from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel, HttpUrl, field_validator
from typing import Optional
from datetime import datetime, timezone
import random, string
from app.db.database import get_db
from app.models.url import ShortURL, ClickEvent
from app.config import settings

router = APIRouter()


def generate_short_code(length: int = 7) -> str:
    chars = string.ascii_letters + string.digits
    return "".join(random.choices(chars, k=length))


class ShortenRequest(BaseModel):
    url: str
    custom_alias: Optional[str] = None
    title: Optional[str] = None
    expires_at: Optional[datetime] = None

    @field_validator("url")
    @classmethod
    def validate_url(cls, v: str) -> str:
        if not v.startswith(("http://", "https://")):
            raise ValueError("URL must start with http:// or https://")
        if len(v) > 2048:
            raise ValueError("URL is too long (max 2048 chars)")
        return v

    @field_validator("custom_alias")
    @classmethod
    def validate_alias(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        if len(v) > settings.max_custom_alias_length:
            raise ValueError(f"Custom alias must be {settings.max_custom_alias_length} chars or fewer")
        if not v.replace("-", "").replace("_", "").isalnum():
            raise ValueError("Custom alias can only contain letters, numbers, hyphens, and underscores")
        return v


class URLResponse(BaseModel):
    id: int
    short_code: str
    short_url: str
    original_url: str
    title: Optional[str]
    click_count: int
    created_at: datetime
    expires_at: Optional[datetime]
    is_active: bool

    class Config:
        from_attributes = True


@router.post("/shorten", response_model=URLResponse, status_code=status.HTTP_201_CREATED)
async def shorten_url(payload: ShortenRequest, request: Request, db: AsyncSession = Depends(get_db)):
    short_code = payload.custom_alias
    if short_code:
        existing = await db.scalar(select(ShortURL).where(ShortURL.short_code == short_code))
        if existing:
            raise HTTPException(status_code=409, detail=f"Alias '{short_code}' is already taken")
    else:
        for _ in range(5):
            candidate = generate_short_code(settings.short_code_length)
            existing = await db.scalar(select(ShortURL).where(ShortURL.short_code == candidate))
            if not existing:
                short_code = candidate
                break
        if not short_code:
            raise HTTPException(status_code=500, detail="Failed to generate a unique short code")

    client_ip = request.client.host if request.client else None
    url_obj = ShortURL(
        original_url=str(payload.url),
        short_code=short_code,
        title=payload.title,
        expires_at=payload.expires_at,
        creator_ip=client_ip,
    )
    db.add(url_obj)
    await db.commit()
    await db.refresh(url_obj)

    return URLResponse(
        id=url_obj.id, short_code=url_obj.short_code,
        short_url=f"{settings.base_url}/{url_obj.short_code}",
        original_url=url_obj.original_url, title=url_obj.title,
        click_count=url_obj.click_count, created_at=url_obj.created_at,
        expires_at=url_obj.expires_at, is_active=url_obj.is_active,
    )


@router.get("/{short_code}")
async def redirect_to_url(short_code: str, request: Request, db: AsyncSession = Depends(get_db)):
    url_obj = await db.scalar(select(ShortURL).where(ShortURL.short_code == short_code, ShortURL.is_active == True))
    if not url_obj:
        raise HTTPException(status_code=404, detail="Short URL not found or has been deactivated")

    if url_obj.expires_at and url_obj.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=410, detail="This short URL has expired")

    url_obj.click_count += 1
    click = ClickEvent(
        short_url_id=url_obj.id,
        referrer=request.headers.get("referer"),
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
    )
    db.add(click)
    await db.commit()

    return RedirectResponse(url=url_obj.original_url, status_code=302)


@router.get("/info/{short_code}", response_model=URLResponse)
async def get_url_info(short_code: str, db: AsyncSession = Depends(get_db)):
    url_obj = await db.scalar(select(ShortURL).where(ShortURL.short_code == short_code))
    if not url_obj:
        raise HTTPException(status_code=404, detail="Short URL not found")
    return URLResponse(
        id=url_obj.id, short_code=url_obj.short_code,
        short_url=f"{settings.base_url}/{url_obj.short_code}",
        original_url=url_obj.original_url, title=url_obj.title,
        click_count=url_obj.click_count, created_at=url_obj.created_at,
        expires_at=url_obj.expires_at, is_active=url_obj.is_active,
    )


class AnalyticsResponse(BaseModel):
    short_code: str
    short_url: str
    original_url: str
    title: Optional[str]
    total_clicks: int
    created_at: datetime
    recent_clicks: list[dict]


@router.get("/analytics/{short_code}", response_model=AnalyticsResponse)
async def get_analytics(short_code: str, db: AsyncSession = Depends(get_db)):
    url_obj = await db.scalar(select(ShortURL).where(ShortURL.short_code == short_code))
    if not url_obj:
        raise HTTPException(status_code=404, detail="Short URL not found")

    result = await db.execute(
        select(ClickEvent)
        .where(ClickEvent.short_url_id == url_obj.id)
        .order_by(ClickEvent.clicked_at.desc())
        .limit(20)
    )
    recent = result.scalars().all()

    return AnalyticsResponse(
        short_code=url_obj.short_code,
        short_url=f"{settings.base_url}/{url_obj.short_code}",
        original_url=url_obj.original_url,
        title=url_obj.title,
        total_clicks=url_obj.click_count,
        created_at=url_obj.created_at,
        recent_clicks=[{
            "clicked_at": c.clicked_at.isoformat(),
            "referrer": c.referrer,
            "user_agent": c.user_agent,
        } for c in recent],
    )


@router.get("/list/all")
async def list_urls(skip: int = 0, limit: int = 20, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ShortURL).order_by(ShortURL.created_at.desc()).offset(skip).limit(limit)
    )
    urls = result.scalars().all()
    total = await db.scalar(select(func.count(ShortURL.id)))
    return {
        "total": total, "skip": skip, "limit": limit,
        "items": [{
            "id": u.id, "short_code": u.short_code,
            "short_url": f"{settings.base_url}/{u.short_code}",
            "original_url": u.original_url, "title": u.title,
            "click_count": u.click_count, "created_at": u.created_at.isoformat(),
            "is_active": u.is_active,
        } for u in urls]
    }


@router.delete("/{short_code}", status_code=status.HTTP_204_NO_CONTENT)
async def deactivate_url(short_code: str, db: AsyncSession = Depends(get_db)):
    url_obj = await db.scalar(select(ShortURL).where(ShortURL.short_code == short_code))
    if not url_obj:
        raise HTTPException(status_code=404, detail="Short URL not found")
    url_obj.is_active = False
    await db.commit()
