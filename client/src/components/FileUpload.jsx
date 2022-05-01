import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Center, useColorModeValue} from '@chakra-ui/react';
import { CloseIcon} from '@chakra-ui/icons'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export default function Uploader(props) {
  const [files, setFiles] = useState([]);

  const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  };

  const img = {
    display: 'block',
    width: '100%',
    height: '100%',
  };

  const thumb = {
    display: 'inline-flex',
    marginBottom: 8,
    marginRight: 8,
    maxWidth: 250,
    maxHeight: 250,
    padding: 4,
    boxSizing: 'border-box'
  };

  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(file =>{
      const reader = new FileReader()
      reader.onload = () => {
        setFiles(prevArray => [...prevArray, reader.result])
      }
      reader.readAsDataURL(file)
    })
    setFiles(prevArray => prevArray.slice(0,5))
  }, [files]);

  const { getRootProps, getInputProps, isDragActive , rejectedFiles, isDragReject} = useDropzone({
      onDrop, 
      accept: 'image/*',
      multiple: true,
      maxFiles: 5,
  });

  const dropText = isDragActive ? 'Drop the pictures here ...' : 'Drag \'n drop or click here to select pictures';

  const activeBg = useColorModeValue('gray.100', 'gray.600');
  const borderColor = useColorModeValue(
      isDragActive ? 'teal.300' : 'gray.300',
      isDragActive ? 'teal.500' : 'gray.500',
  );

  useEffect(() => {
    if (props.onChange) {
      props.onChange(files)
    }
  }, [files]);

  const removeImage = (event,index) => {
    event.preventDefault()
    var newArray = files.slice(0,index).concat(files.slice(index+1))
    setFiles(newArray);
  };

  const handleDragStart = (event,targetId) => {
    event.dataTransfer.setData("image", targetId);
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDragEnd = (event) => {
    event.preventDefault()
  }

  const handleDrop = (event, targetId) => {
    event.preventDefault();
    let sourceId = event.dataTransfer.getData("image");
    sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
    let newArray = [...files]
    newArray.splice(targetId, 0 ,newArray.splice(sourceId,1)[0])
    setFiles(newArray)
  }
  const thumbs = files.slice(0,5).map((file,index) => (
    <div style={thumb}>
      <Center style={thumbInner}     
          id = {"image-" + index}        
          draggable = 'true'
          onDragStart = {(event) => handleDragStart(event,index)}
          onDragOver = {(event) => handleDragOver(event)}
          onDragEnd = {(event) => handleDragEnd(event)}
          onDrop = {(event) => handleDrop(event,index)}
          >
        <Zoom>
          <img
            src={file}
            style={img}
          />
        </Zoom>
      </Center>
      <CloseIcon onClick={(event) => removeImage(event,index)}/>
    </div>
  ));

  return (
    <div>
      <aside style={thumbsContainer}>
        {thumbs}
      </aside>
      <Center
          p={10}
          cursor="pointer"
          bg={isDragActive ? activeBg : 'transparent'}
          _hover={{ bg: activeBg }}
          transition="background-color 0.2s ease"
          borderRadius={4}
          border="3px dashed"
          borderColor={borderColor}
          {...getRootProps()}
          >
          <input {...getInputProps()}/>
          <div>
            <Center>
              {dropText}
            </Center>
            <Center>
              (At least one picture is required, at most five pictures)
            </Center>
            <Center>
              Drag pictures to rearrange
            </Center>
          </div>
      </Center>
    </div>
  );
}