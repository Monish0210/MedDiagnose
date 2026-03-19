from fastapi import APIRouter, Request


router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.get("/")
def get_metrics(request: Request) -> dict:
	return request.app.state.evaluator.get_results()


@router.get("")
def get_metrics_no_slash(request: Request) -> dict:
	return request.app.state.evaluator.get_results()

