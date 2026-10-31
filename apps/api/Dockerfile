FROM python:3.12-slim
WORKDIR /app
COPY packages/backend /pkg/backend
RUN pip install --no-cache-dir "/pkg/backend[all]"
COPY apps/api/ .
ENV DATA_DIR=/data
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
