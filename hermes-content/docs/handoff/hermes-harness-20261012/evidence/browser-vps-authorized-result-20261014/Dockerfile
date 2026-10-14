FROM mcr.microsoft.com/playwright/python:v1.62.0-noble@sha256:aa81288e738725378becba5b3e06cb0f3a7f012a610e87e8d767a090ea3f740d
LABEL org.onia.playwright.base-digest="sha256:aa81288e738725378becba5b3e06cb0f3a7f012a610e87e8d767a090ea3f740d"
LABEL org.onia.playwright.requirements-sha256="52e857275e075417fa9e5b934f3b41d0366a55fc25187b7f40dbb3df34ed6a4e"
COPY requirements.lock /tmp/onia-requirements.lock
RUN python3 -m pip install --no-cache-dir --no-compile --only-binary=:all: --require-hashes --index-url=https://pypi.org/simple -r /tmp/onia-requirements.lock && rm /tmp/onia-requirements.lock
USER pwuser
WORKDIR /tmp
ENTRYPOINT ["python3", "-"]
