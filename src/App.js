import { Component } from 'react';
import Clarifai from 'clarifai'
import Particles from 'react-particles-js';
import FaceReckognition from './Components/FaceReckognition/FaceReckognition'
import Navigation from './Components/Navigation/Navigation'
import Signin from './Components/Signin/signin'
import Register from './Components/Register/Register'
import Logo from './Components/Logo/Logo'
import Rank from './Components/Rank/Rank'
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm'
import './App.css';


const app = new Clarifai.App({
  apiKey: '04a66b0d1c6747c2a0b54605b8bfb3a6'
});

const particlesOptions={
  particles:{
    number:{
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
      
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageURL:'',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) =>{
      const clarifaiFace =  data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)

      }
    
    }

  displayFaceBox = (box) =>{
    this.setState({box: box})
  }  

  onInputChange = (event) =>{
      this.setState({input: event.target.value});
  }

  onButtonSubmit = () =>{
    this.setState({imageURL: this.state.input})
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  onRouteChange = (route) =>{
    if(route ==='signout'){
      this.setState({isSignedIn:false})
    } else if ( route === 'home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route: route});
  }

  render(){
    const {isSignedIn, imageURL, route, box} = this.state;
    return (
      <div className="App">
        <Particles className='particles'
            params={particlesOptions} 
          />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' 
          ? <div>
              <Logo/>
              <Rank />
              <ImageLinkForm 
                  onInputChange ={this.onInputChange} 
                  onButtonSubmit={this.onButtonSubmit}
                />
              <FaceReckognition box={box} imageURL={imageURL}/>  
            </div>          
          : (
              route === 'signin'
              ? <Signin onRouteChange={this.onRouteChange}/>
              : <Register onRouteChange={this.onRouteChange}/>
          )
        }    
             
      </div>
    );
  }
}

export default App;


