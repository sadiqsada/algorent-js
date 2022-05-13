  const handleImages = (imgUrls) => {
    let imgUrlsArray = imgUrls[0].slice(1, -1).split(", ");
    let formattedImgUrls = [];
    imgUrlsArray.forEach(img => formattedImgUrls.push({url: img.slice(1, -1)}));
    return formattedImgUrls;
  }

  export default handleImages;