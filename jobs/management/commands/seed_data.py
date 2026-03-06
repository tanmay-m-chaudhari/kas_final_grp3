from django.core.management.base import BaseCommand
from jobs.models import Company, Job
from django.contrib.auth.models import User
import datetime


class Command(BaseCommand):
    help = "Seed the database with sample jobs and companies"

    def handle(self, *args, **options):
        if Job.objects.count() > 0:
            self.stdout.write("Database already seeded. Skipping.")
            return

        companies = [
            Company(name="TechCorp Solutions", website="https://techcorp.example.com",
                    description="A leading software solutions company building enterprise SaaS products."),
            Company(name="DataVision AI", website="https://datavision.example.com",
                    description="AI-powered analytics and machine learning services for mid-market companies."),
            Company(name="CloudBase Inc", website="https://cloudbase.example.com",
                    description="Cloud infrastructure and DevOps consultancy with a fully remote team."),
            Company(name="PixelCraft Studio", website="https://pixelcraft.example.com",
                    description="Product design and UI/UX studio working with startups and scale-ups."),
        ]
        Company.objects.bulk_create(companies)
        tc, dv, cb, pc = Company.objects.all()[:4]

        jobs = [
            Job(title="Senior Backend Engineer", company=tc, job_type="full_time", experience_level="senior",
                location="San Francisco, CA", salary_min=140000, salary_max=180000,
                description="Join our platform team to build and scale our core API infrastructure serving millions of users.",
                requirements="5+ years of backend experience\nProficiency in Python or Go\nExperience with PostgreSQL and Redis\nKnowledge of distributed systems",
                skills="Python,Go,PostgreSQL,Redis,Kubernetes", deadline=datetime.date(2025, 3, 31)),
            Job(title="Machine Learning Engineer", company=dv, job_type="full_time", experience_level="mid",
                location="New York, NY", salary_min=120000, salary_max=160000,
                description="Build and deploy ML models that power our real-time analytics dashboards.",
                requirements="3+ years ML experience\nPython, PyTorch or TensorFlow\nExperience with MLOps pipelines\nStrong statistics foundation",
                skills="Python,PyTorch,TensorFlow,MLflow,AWS SageMaker", deadline=datetime.date(2025, 4, 15)),
            Job(title="DevOps / Platform Engineer", company=cb, job_type="remote", experience_level="mid",
                location="Remote (US)", salary_min=110000, salary_max=145000,
                description="Own and evolve our Kubernetes-based deployment infrastructure and CI/CD pipelines.",
                requirements="3+ years DevOps/SRE experience\nKubernetes, Terraform, Helm\nCI/CD with GitHub Actions or similar\nOn-call rotation participation",
                skills="Kubernetes,Terraform,Helm,GitHub Actions,Prometheus,Grafana"),
            Job(title="Frontend Engineer (React)", company=tc, job_type="full_time", experience_level="mid",
                location="Austin, TX", salary_min=100000, salary_max=135000,
                description="Build beautiful and performant user interfaces for our enterprise dashboard product.",
                requirements="3+ years React experience\nTypeScript proficiency\nExperience with testing (Jest, Cypress)\nEye for design and UX",
                skills="React,TypeScript,Next.js,Tailwind CSS,Jest"),
            Job(title="UI/UX Designer", company=pc, job_type="full_time", experience_level="mid",
                location="Los Angeles, CA", salary_min=90000, salary_max=120000,
                description="Create user-centred designs from wireframes to high-fidelity prototypes for our client products.",
                requirements="Portfolio demonstrating strong product design\nFigma proficiency\nExperience with design systems\nAbility to run user research",
                skills="Figma,Sketch,User Research,Design Systems,Prototyping"),
            Job(title="Data Engineer", company=dv, job_type="full_time", experience_level="senior",
                location="Chicago, IL", salary_min=130000, salary_max=165000,
                description="Design and build the data pipelines that feed our AI models and BI dashboards.",
                requirements="5+ years data engineering experience\nSpark, dbt, Airflow\nData warehouse experience (Snowflake or BigQuery)\nSQL expert",
                skills="Python,Spark,dbt,Airflow,Snowflake,BigQuery"),
            Job(title="Junior Frontend Developer", company=pc, job_type="internship", experience_level="entry",
                location="Remote", salary_min=25, salary_max=35,
                description="6-month internship building components in our design system and client projects.",
                requirements="Studying Computer Science or related\nBasic React and JavaScript\nCSS skills\nEager to learn",
                skills="JavaScript,React,CSS,HTML"),
        ]
        Job.objects.bulk_create(jobs)

        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser("admin", "admin@jobboard.example", "admin123")
            self.stdout.write("Created superuser: admin / admin123")

        self.stdout.write(self.style.SUCCESS(f"Seeded {len(companies)} companies and {len(jobs)} jobs."))
