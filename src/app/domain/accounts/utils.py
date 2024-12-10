import os
from typing import cast
from uuid import UUID

import boto3
import structlog
from botocore.exceptions import BotoCoreError, ClientError

app_s3_bucket_name = os.environ["APP_S3_BUCKET_NAME"]

logger = structlog.get_logger()


def get_signed_user_profile_pic_url(user_id: UUID, extension: str = "webp", expiration: int = 3600) -> str | None:
    try:
        s3_client = boto3.client("s3")
        signed_url = s3_client.generate_presigned_url(
            ClientMethod="get_object",
            Params={"Bucket": app_s3_bucket_name, "Key": f"tenants/users/avatars/{user_id}.webp"},
            ExpiresIn=expiration,
        )
        return cast(str, signed_url)
    except (BotoCoreError, ClientError) as e:
        error_msg = "Error getting signed user profile pic url"
        logger.exception(error_msg, user_id=user_id, exc_info=e)
        return None
