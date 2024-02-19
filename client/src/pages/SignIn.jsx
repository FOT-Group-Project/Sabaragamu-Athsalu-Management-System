import {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import logo from '../assets/logo.png'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'

export default function SignIn() {

  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector(state => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.username || !formData.password){
      return dispatch(signInFailure('Please fill all the fields'));
    }

    try{
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if(data.success === false){
        dispatch(signInFailure(data.message));
      }

      if(res.ok){
        dispatch(signInSuccess(data));
        navigate('/dashboard');
      }

    }catch(error){
      dispatch(signInFailure(error.message));
    }
  }


  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-10'>
        {/* left side */}
        <div className='flex-1'>
          <Link to="/" className=''>
           <img src={logo} class="h-16" alt="Flowbite Logo" />
          </Link>
          <p className='text-sm mt-5'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex officiis harum vel magni, tenetur neque officia ducimus..</p>
        </div>

        {/* right side */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <h3 className='text-2xl font-bold dark:text-white'>Log In</h3>
            <div>
              <Label value='Your User Name'/>
              <TextInput type='text' placeholder='maleesha71' id='username' onChange={handleChange}/>
            </div>
            <div>
              <Label value='Your Password'/>
              <TextInput type='password' placeholder='***********' id='password' onChange={handleChange}/>
            </div>
            <Button color='blue' type='submit' disabled={loading}>
                {
                  loading ? (
                    <>
                      <Spinner size='sm' />
                      <span className='pl-3'>Loading...</span>
                    </>
                    
                  ) : (
                    'Log In'
                  ) 
                }    
            </Button>
          </form>
          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}
