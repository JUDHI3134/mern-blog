import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {getDownloadURL, getStorage, uploadBytesResumable,ref} from 'firebase/storage'
import {app} from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {updateStart,updateSuccess,updateFailuer,deleteUserStart,deleteUserSuccess,deleteUserFailuer,signoutSuccess} from '../redux/user/userSlice'
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import {Link} from 'react-router-dom'

function DashProfile() {
    const {currentUser,error,loading} = useSelector((state) => state.user);
    const [imageFile,setImageFile] = useState(null);
    const [imageFileUrl,setImagefileUrl] = useState(null);
    const [imageFileUploadProgress,setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError,setImageFileUploadError] = useState(null)
    const [imageFileUploading,setImageFileUploading] = useState(false)
    const [formData,setFormData] = useState({})
    const [updateUserSuccess,setUpdateUserSuccess] = useState(null)
    const [updateUserError,setUpdateUserError] = useState(null)
    const [showModal,setShowModal] = useState(false)
    const filepickerRef = useRef();
    const dispatch = useDispatch();
    const handleImageChange = (e) =>{
        const file = e.target.files[0];
        if(file){
            setImageFile(file);
            setImagefileUrl(URL.createObjectURL(file))
        }
    }
    useEffect(()=>{
        if(imageFile){
            uploadImage();
        }
    },[imageFile]);

    const uploadImage = async()=>{
        // service firebase.storage {
        //     match /b/{bucket}/o {
        //       match /{allPaths=**} {
        //         allow read;
        //         allow write: if
        //         request.resource.size < 2*1024*1024 &&
        //         request.resource.contentType.matches('image/.*')
        //       }
        //     }
        //   }
        setImageFileUploading(true)
        setImageFileUploadError(null)
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage,fileName);
        const uploadTask = uploadBytesResumable(storageRef,imageFile);
        uploadTask.on(
            'state_changed',
            (snapshot) =>{
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0))
            },
            (error) =>{
               setImageFileUploadError('could not upload image (File must be less than 2MB)')
               setImageFileUploadProgress(null);
               setImageFile(null);
               setImagefileUrl(null);
               setImageFileUploading(false)
            },
            () =>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
                    setImagefileUrl(downloadURL);
                    setFormData({...formData,profilePicture: downloadURL});
                    setImageFileUploading(false)
                })
            }
        )
    }

    const handleChange = (e) =>{
        setFormData({...formData,[e.target.id]:[e.target.value]})
    };
    // console.log(formData)

    const handleSubmit =async (e) =>{
       e.preventDefault();
       setUpdateUserError(null)
       setUpdateUserSuccess(null)
       if(Object.keys(formData).length === 0){
        setUpdateUserError('no changes made')
        return;
       }
       if(imageFileUploading){
        setUpdateUserError('please wait for image to upload')
        return;
       }
       try {
        dispatch(updateStart());
        const res = await fetch(`api/user/update/${currentUser._id}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(formData)
        });
        const data = await res.json()
        if(!res.ok){
            dispatch(updateFailuer(data.message))
            setUpdateUserError(data.message)
        }else{
            dispatch(updateSuccess(data))
            setUpdateUserSuccess("Users profile update successfully")
        }
       } catch (error) {
        dispatch(updateFailuer(error.message))
        setUpdateUserError(error.message)
       }
    }

    const handleDeleteUser = async()=>{
        setShowModal(false);
        try {
          dispatch(deleteUserStart());
          const res = await fetch(`/api/user/delete/${currentUser._id}`,{
            method:'DELETE',
          });
          const data = await res.json();
          if(!res.ok){
            dispatch(deleteUserFailuer(data.message));
          }else{
            dispatch(deleteUserSuccess(data))
          }
        } catch (error) {
            dispatch(deleteUserFailuer(error.message))
        }
    }

    const handleSignout = async()=>{
        try {
           const res = await fetch('/api/user/signout',{
            method:'POST',
           });
           const data = await res.json();
           if(!res.ok){
            console.log(data.message)
           }else{
             dispatch(signoutSuccess())
           }
        } catch (error) {
            console.log(error.message)
        }
    }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="file" accept='images/*' onChange={handleImageChange} ref={filepickerRef} hidden/>

        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=>{filepickerRef.current.click()}}>

            {imageFileUploadProgress && (
                <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`} strokeWidth={5}
                styles={{
                    root:{
                        width:'100%',
                        height:'100%',
                        position:'absolute',
                        top:0,
                        left:0,
                    },
                    path:{
                        stroke:`rgba(62,152,199,${imageFileUploadProgress / 100})`
                    }
                }}
                />
            )}


        <img src={imageFileUrl || currentUser.profilePicture} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray ${imageFileUploadProgress && imageFileUploadProgress<100 && 'opacity-60'}`} />
        </div>
        {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange}/>
        <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange}/>
        <TextInput type='password' id='password' placeholder='*********' onChange={handleChange}/>
        <Button type='submit' gradientDuoTone='purpleToBlue' outline disabled={loading  || imageFileUploading}>
           {loading ? 'Loading...' : 'Update'}
        </Button>

        <Link to='/create-post'>
        {currentUser.isAdmin && (
            <Button type='button' gradientDuoTone='purpleToPink' className='w-full' >
                Create a post
            </Button>
        )}
        </Link>
        



      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={()=>setShowModal(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
            {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
            {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className='mt-5'>
            {error}
        </Alert>
      )}

      <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
       <Modal.Header/>
       <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto mb-4'/>
            <h3 className='mb-5 text-lg text-gray-400 dark:text-gray-400'>Are you sure you want to delete your Account</h3>
            <div className='flex justify-center gap-4'>
                <Button color='failure' onClick={handleDeleteUser}>Yes I'm Sure</Button>
                <Button color='gray' onClick={()=>setShowModal(false)}>No,Cancel</Button>
            </div>
          </div>
       </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashProfile
