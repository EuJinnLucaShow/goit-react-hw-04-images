import { useState, useEffect } from 'react';
import axios from 'axios';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';
import { AppDiv } from './App.syled';
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    if (query === '') {
      return;
    }
    setImages([]);
    setPage(1);
    setIsLastPage(false);
    fetchImages();  
  }, [query])

   
   async function fetchImages() {
    const API_KEY = '34187261-edb3bdfe414ee3b7adebeccc5';

    setIsLoading(true);
    
    try {
      await axios
        .get(
          `https://pixabay.com/api/?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
        )
        .then(response => {
          const { hits, totalHits } = response.data;

          if (hits.length === 0) {            
            toast('Sorry, there are no images matching your request...', {
              position: toast.POSITION.TOP_CENTER,
              icon: '🤔'
            });           
          }

          const modifiedHits = hits.map(({ id, tags, webformatURL, largeImageURL }) => ({
            id,
            tags,
            webformatURL,
            largeImageURL
          }));

          setImages(prevImages => [...prevImages, ...modifiedHits]);
          setPage(prevPage => prevPage + 1);
          setIsLastPage(images.length + modifiedHits.length >= totalHits);
        })
     } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};

  const handleSearchSubmit = newQuery => {
    if (query === newQuery) {
      return;
    }
    setQuery(newQuery);
  };

  const handleImageClick = image => {
    setSelectedImage(image);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleModalClose = () => {
    setSelectedImage(null);
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <AppDiv>
      <ToastContainer transition={Flip} />
      <Searchbar onSubmit={handleSearchSubmit} />

      {error && <p>Error: {error}</p>}

      <ImageGallery images={images} onItemClick={handleImageClick} />

      {isLoading && <Loader />}

      {!isLoading && images.length > 0 && !isLastPage && <Button onClick={fetchImages} />}

      {showModal && <Modal image={selectedImage} onClose={handleModalClose} />}
    </AppDiv>
  );
};

export default App;
