import React, {useState, useEffect} from "react";

function UploadImage(){
    const [image, setImage] = useState<FileList | null>()
    const [imageURL, setImageURL] = useState<string>()

    useEffect(()=>{
        if (!image) return
        console.log(image)
        const newImageURL = URL.createObjectURL(image[0])
        setImageURL(newImageURL)
        console.log(imageURL)


    }, [image])

    return(
        <>
        <input type="file" accept="image/*" onChange={(event)=>{setImage(event.target.files)} }></input>
        </>
    )
}

export default UploadImage