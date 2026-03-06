from django.contrib import admin
from .models import Job, Company, Application


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ["name", "website", "created_at"]
    search_fields = ["name"]


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ["title", "company", "job_type", "experience_level", "location", "is_active", "created_at"]
    list_filter = ["job_type", "experience_level", "is_active"]
    search_fields = ["title", "company__name", "skills"]
    list_editable = ["is_active"]


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ["applicant_name", "applicant_email", "job", "status", "applied_at"]
    list_filter = ["status"]
    list_editable = ["status"]
    search_fields = ["applicant_name", "applicant_email"]
