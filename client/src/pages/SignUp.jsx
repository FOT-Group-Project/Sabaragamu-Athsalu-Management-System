import {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import logo from '../assets/logo.png'

export default function SignUp() {

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.username || !formData.email || !formData.password){
      return setErrorMessage('All fields are required');
    }

    try{
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if(data.success === false){
        setLoading(false);
        return setErrorMessage(data.message);
      }
      setLoading(false);

      if(res.ok){
        navigate('/sign-in');
      }

    }catch(error){
      setErrorMessage(error.message);
      setLoading(false);
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
          <h3 className='text-2xl font-bold dark:text-white'>Sign Up</h3>
          <div>
            <Label value='Your Name'/>
            <TextInput type='text' placeholder='Maleesha' id='username' onChange={handleChange}/>
          </div>
          <div>
            <Label value='Your Email'/>
            <TextInput type='email' placeholder='name@company.com' id='email' onChange={handleChange}/>
          </div>
          <div>
            <Label value='Your Password'/>
            <TextInput type='password' placeholder='***********' id='password' onChange={handleChange}/>
          </div>
          <Button color='blue' type='submit' disabled={Loading}>
                {
                  Loading ? (
                    <>
                      <Spinner size='sm' />
                      <span className='pl-3'>Loading...</span>
                    </>
                    
                  ) : (
                    'Sign Up'
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
