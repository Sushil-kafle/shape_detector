from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from io import BytesIO
from PIL import Image
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def hello():
    return {"Hello": "World"}


class ImageData(BaseModel):
    imageData: str


@app.post("/upload")
async def upload_image(data: ImageData):
    image_data = base64.b64decode(data.imageData)
    image = Image.open(BytesIO(image_data))

    image.save("uploaded_image.png")

    return {
        "status": "success",
        "message": "Image processed successfully",
    }
