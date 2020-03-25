/* eslint-disable complexity */
/* eslint-disable no-use-before-define */
import {AR} from 'expo'
import {GraphicsView} from 'expo-graphics'
import {Renderer, THREE} from 'expo-three'
import {BackgroundTexture, Camera} from 'expo-three-ar'
import {connect} from 'react-redux'
import * as React from 'react'
import {computePos, SCALER} from './utils'
import {Platform, View, Text, StyleSheet, ImageBackground} from 'react-native'
import {
  getCurrentPosition,
  stopTracking,
  fetchCrums,
  fetchNearByCrumInstances,
  me
} from '../store/'
import DropCrumForm from './DropCrumForm'
import {images, fonts} from '../../assets/'
import {createCube, createPlane, createText} from './Crums.js'

class DisARScreen extends React.Component {
  state = {
    longitudeIdx: undefined, // longitudeIdx is the integer version of longitude it is the floor of (SCALER * longitude)
    latitudeIdx: undefined, // likewise, it is floor of (SCALER * latitude)
    numCrum: 0,
    loading: true
  }

  componentDidMount = () => {
    THREE.suppressExpoWarnings(true)
    this.props.subscribeToLocationData() // this subscribed to update current locations every time interval
    this.props.fetchCrums()
  }
  componentWillUnmount = () => {
    this.props.unsubscribeToLocationData() // this unsubscribed to update current locations
    THREE.suppressExpoWarnings(false)
  }

  // longitudeIdx is the integer version of longitude it is the floor of (SCALER * longitude), likewise latitude is the floor of (SCALER * latitude)
  // we get longitudeIdx and latitude from REDUX store, and store it in our REACT state
  // when longitudeIdx or latitude in REDUX store changes, we update REACT state
  // we also requery the list of nearby crums
  // this is subject to future optimization and code refactoring
  // More at https://reactjs.org/docs/hooks-faq.html#how-to-memoize-calculations
  static getDerivedStateFromProps(props, state) {
    if (
      Number.isInteger(props.locations.longitudeIdx) && //initially longitudeIdx and latitudeIdx are NaN
      Number.isInteger(props.locations.latitudeIdx) &&
      state.loading === true
    ) {
      console.log('remounting', 'state', state.longitudeIdx, state.latitudeIdx)
      return {
        ...state,
        loading: false
      }
    }
    if (
      Number.isInteger(props.locations.longitudeIdx) && //initially longitudeIdx and latitudeIdx are NaN
      Number.isInteger(props.locations.latitudeIdx) &&
      (props.locations.latitudeIdx !== state.latitudeIdx ||
        props.locations.longitudeIdx !== state.longitudeIdx ||
        props.crumInstances.length !== state.numCrum)
    ) {
      props.fetchCrumInstances(
        props.locations.latitudeIdx,
        props.locations.longitudeIdx
      )
      return {
        ...state,
        latitudeIdx: props.locations.latitudeIdx,
        longitudeIdx: props.locations.longitudeIdx,
        numCrum: props.crumInstances.length
        // loading: true
      }
    } else {
      return state
    }
  }
  render() {
    const {locations, crumInstances, numCrum, crums} = this.props
    // console.log('CRUM INSTANCES AR VIEW:', numCrum)
    AR.setWorldAlignment('gravityAndHeading') // The coordinate system's y-axis is parallel to gravity, its x- and z-axes are oriented to compass heading, and its origin is the initial position of the device. z:1 means 1 meter South, x:1 means 1 meter east. other options are alignmentCamera and gravity
    if (Platform.OS !== 'ios') return <div>AR only supports IOS device</div>

    const onContextCreate = async ({gl, pixelRatio, width, height}) => {
      this.setState({loading: false})
      AR.setWorldAlignment('gravityAndHeading')
      this.renderer = new Renderer({gl, pixelRatio, width, height})
      this.scene = new THREE.Scene()
      this.scene.background = new BackgroundTexture(this.renderer)
      this.camera = new Camera(width, height, 0.01, 1000)

      crumInstances.forEach(async crumInstance => {
        const pos = computePos(crumInstance, locations)
        let plane = await createPlane(
          0xffffff,
          images[crumInstance.crum.name],
          pos
        )

        this.scene.add(plane)
      })

      this.scene.add(new THREE.AmbientLight(0xffffff))
    }

    const onResize = ({scale, width, height}) => {
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
      this.renderer.setPixelRatio(scale)
      this.renderer.setSize(width, height)
    }

    const onRender = delta => {
      // run every frame
      this.renderer.render(this.scene, this.camera)
    }

    return (
      <ImageBackground
        source={require('../../public/background.png')}
        style={{
          flex: 1,
          width: null,
          height: null
        }}
      >
        <View style={styles.main}>
          <View style={{flex: 1}}>
            {this.state.loading === false ? (
              <View style={{flex: 1, height: '100%'}}>
                <GraphicsView
                  style={{flex: 1}}
                  onContextCreate={onContextCreate}
                  onRender={onRender}
                  onResize={onResize}
                  isArEnabled
                  isArCameraStateEnabled
                />
              </View>
            ) : (
              <Text>wait</Text>
            )}
            <DropCrumForm />
          </View>
        </View>
      </ImageBackground>
    )
  }
}

const mapState = state => ({
  isLoggedIn: !!state.user.id,
  user: state.user,
  locations: {
    ...state.locations,
    longitudeIdx: Math.floor(state.locations.longitude * SCALER),
    latitudeIdx: Math.floor(state.locations.latitude * SCALER)
  },
  crumInstances: state.crumInstances
})
const mapDispatch = dispatch => {
  return {
    getUser: () => {
      dispatch(me())
    },
    subscribeToLocationData: () => {
      dispatch(getCurrentPosition())
    },
    unsubscribeToLocationData: () => {
      dispatch(stopTracking())
    },
    fetchCrums: () => {
      dispatch(fetchCrums())
    },
    fetchCrumInstances: (latitudeIdx, longitudeIdx) => {
      dispatch(fetchNearByCrumInstances(latitudeIdx, longitudeIdx))
    }
  }
}

const ARScreen = connect(mapState, mapDispatch)(DisARScreen)

export default ARScreen

const styles = StyleSheet.create({
  main: {
    height: '100%',
    width: '100%'
  }
})
