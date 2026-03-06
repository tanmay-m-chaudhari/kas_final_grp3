from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.db.models import Q, Count
from django.core.paginator import Paginator
from .models import Job, Company, Application
from .forms import ApplicationForm, JobFilterForm


def job_list(request):
    form = JobFilterForm(request.GET)
    jobs = Job.objects.filter(is_active=True).select_related("company")

    if form.is_valid():
        q = form.cleaned_data.get("q")
        job_type = form.cleaned_data.get("job_type")
        experience = form.cleaned_data.get("experience")
        location = form.cleaned_data.get("location")

        if q:
            jobs = jobs.filter(
                Q(title__icontains=q) | Q(description__icontains=q) |
                Q(skills__icontains=q) | Q(company__name__icontains=q)
            )
        if job_type:
            jobs = jobs.filter(job_type=job_type)
        if experience:
            jobs = jobs.filter(experience_level=experience)
        if location:
            jobs = jobs.filter(location__icontains=location)

    paginator = Paginator(jobs, 10)
    page_obj = paginator.get_page(request.GET.get("page"))

    stats = {
        "total_jobs": Job.objects.filter(is_active=True).count(),
        "total_companies": Company.objects.count(),
        "remote_jobs": Job.objects.filter(is_active=True, job_type="remote").count(),
    }

    return render(request, "jobs/job_list.html", {"page_obj": page_obj, "form": form, "stats": stats})


def job_detail(request, pk):
    job = get_object_or_404(Job, pk=pk, is_active=True)
    application_form = ApplicationForm()
    already_applied = False

    if request.method == "POST":
        application_form = ApplicationForm(request.POST, request.FILES)
        if application_form.is_valid():
            application = application_form.save(commit=False)
            application.job = job
            try:
                application.save()
                messages.success(request, "✅ Your application has been submitted successfully!")
                return redirect("job_detail", pk=pk)
            except Exception:
                messages.error(request, "You have already applied for this position.")
        else:
            messages.error(request, "Please correct the errors below.")

    already_applied = Application.objects.filter(
        job=job, applicant_email=request.POST.get("applicant_email", "")
    ).exists()

    similar_jobs = Job.objects.filter(
        is_active=True, company=job.company
    ).exclude(pk=pk)[:3]

    return render(request, "jobs/job_detail.html", {
        "job": job,
        "form": application_form,
        "similar_jobs": similar_jobs,
        "already_applied": already_applied,
    })


def company_list(request):
    companies = Company.objects.annotate(job_count=Count("jobs", filter=Q(jobs__is_active=True))).order_by("-job_count")
    return render(request, "jobs/company_list.html", {"companies": companies})


def company_detail(request, pk):
    company = get_object_or_404(Company, pk=pk)
    jobs = company.jobs.filter(is_active=True)
    return render(request, "jobs/company_detail.html", {"company": company, "jobs": jobs})
