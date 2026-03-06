from django import forms
from .models import Application


class ApplicationForm(forms.ModelForm):
    class Meta:
        model = Application
        fields = ["applicant_name", "applicant_email", "cover_letter", "resume", "linkedin_url"]
        widgets = {
            "applicant_name": forms.TextInput(attrs={"class": "form-input", "placeholder": "Your full name"}),
            "applicant_email": forms.EmailInput(attrs={"class": "form-input", "placeholder": "you@example.com"}),
            "cover_letter": forms.Textarea(attrs={"class": "form-textarea", "rows": 6, "placeholder": "Tell us why you're a great fit..."}),
            "resume": forms.FileInput(attrs={"class": "form-file", "accept": ".pdf,.doc,.docx"}),
            "linkedin_url": forms.URLInput(attrs={"class": "form-input", "placeholder": "https://linkedin.com/in/yourprofile"}),
        }

    def clean_resume(self):
        resume = self.cleaned_data.get("resume")
        if resume:
            allowed_types = ["application/pdf", "application/msword",
                             "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
            if hasattr(resume, "content_type") and resume.content_type not in allowed_types:
                raise forms.ValidationError("Only PDF and Word documents are accepted.")
            if resume.size > 5 * 1024 * 1024:
                raise forms.ValidationError("Resume file must be under 5MB.")
        return resume


class JobFilterForm(forms.Form):
    q = forms.CharField(required=False, widget=forms.TextInput(attrs={"class": "form-input", "placeholder": "Search jobs, skills, companies…"}))
    job_type = forms.ChoiceField(required=False, choices=[("", "All Types")] + [
        ("full_time", "Full Time"), ("part_time", "Part Time"), ("contract", "Contract"),
        ("internship", "Internship"), ("remote", "Remote"),
    ], widget=forms.Select(attrs={"class": "form-select"}))
    experience = forms.ChoiceField(required=False, choices=[("", "Any Level")] + [
        ("entry", "Entry Level"), ("mid", "Mid Level"), ("senior", "Senior Level"), ("lead", "Lead"),
    ], widget=forms.Select(attrs={"class": "form-select"}))
    location = forms.CharField(required=False, widget=forms.TextInput(attrs={"class": "form-input", "placeholder": "City or Remote"}))
