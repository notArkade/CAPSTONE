import httpx
from fastapi import APIRouter, HTTPException

from app.db.supabase import SupabaseNotConfiguredError, supabase
from app.schemas.region import Region

router = APIRouter(tags=["regions"])


def database_error(error: Exception) -> HTTPException:
    if isinstance(error, SupabaseNotConfiguredError):
        return HTTPException(status_code=503, detail="Supabase is not configured. Add backend/.env and run the database SQL scripts.")
    return HTTPException(status_code=502, detail="Unable to retrieve regions from Supabase.")


@router.get("/regions", response_model=list[Region])
async def list_regions() -> list[Region]:
    try:
        return await supabase.list_regions()
    except (SupabaseNotConfiguredError, httpx.HTTPError) as error:
        raise database_error(error) from error


@router.get("/regions/{region_id}", response_model=Region)
async def get_region(region_id: str) -> Region:
    try:
        region = await supabase.get_region(region_id.upper())
    except (SupabaseNotConfiguredError, httpx.HTTPError) as error:
        raise database_error(error) from error
    if region is None:
        raise HTTPException(status_code=404, detail="Region not found")
    return region
