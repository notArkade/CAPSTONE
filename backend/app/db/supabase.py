"""Minimal Supabase REST access, kept out of API route handlers."""

import httpx

from app.core.config import get_settings
from app.schemas.region import Region


class SupabaseNotConfiguredError(RuntimeError):
    pass


class SupabaseService:
    def _headers(self) -> dict[str, str]:
        settings = get_settings()
        if not settings.supabase_url or not settings.supabase_service_role_key:
            raise SupabaseNotConfiguredError("Supabase credentials are not configured")
        return {
            "apikey": settings.supabase_service_role_key,
            "Authorization": f"Bearer {settings.supabase_service_role_key}",
        }

    def _url(self, path: str) -> str:
        settings = get_settings()
        if not settings.supabase_url:
            raise SupabaseNotConfiguredError("Supabase URL is not configured")
        return f"{settings.supabase_url.rstrip('/')}/rest/v1/{path}"

    async def list_regions(self) -> list[Region]:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(self._url("regions"), headers=self._headers(), params={"select": "code,name,region_type,created_at", "order": "name"})
        response.raise_for_status()
        return [self._to_api_region(item) for item in response.json()]

    async def get_region(self, region_id: str) -> Region | None:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(self._url("regions"), headers=self._headers(), params={"select": "code,name,region_type,created_at", "code": f"eq.{region_id}", "limit": "1"})
        response.raise_for_status()
        rows = response.json()
        return self._to_api_region(rows[0]) if rows else None

    @staticmethod
    def _to_api_region(row: dict[str, object]) -> Region:
        # `id` is the stable public region identifier; the database UUID remains internal.
        return Region.model_validate({"id": row["code"], **row})


supabase = SupabaseService()
