import * as React from 'react'
import {connect} from 'react-redux'
import {getSingleUser, fetchUserCrumInstances} from '../store'
import {logout} from '../store/user'
import EditUserModalForm from './EditUserModalForm'
import ViewCrumsModal from './ViewCrumsModal'
import UserSettingsModal from './UserSettingsModal'
// import DeviceInfo from 'react-native-device-info'
import {LinearGradient} from 'expo-linear-gradient'
import {
  Platform,
  Button,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  Alert
} from 'react-native'
import {useFocusEffect} from '@react-navigation/native'
function UserProfile(props) {
  // async componentDidMount() {
  //   const {navigation} = await this.props
  //   navigation.addListener('focus', () =>
  //     // run function that updates the data on entering the screen
  //     this.props.getSingleUser(this.props.user.id),
  //     this.props.fetchUserCrumInstances(this.props.user.id)
  //   )
  // }

  // handleSignOut() {
  //   this.props.logout()
  // }

  useFocusEffect(
    React.useCallback(() => {
      props.getSingleUser(props.user.id)
    }, [props.user.id])
  )

  const {user} = props
  // console.log('state', props)
  return (
    <View style={styles.main}>
      <View style={styles.topContainer}>
        <Image
          source={require('../../public/defaultProfile1.png')}
          style={{
            width: 220,
            height: 220,
            marginRight: 10,
            marginBottom: 12,
            marginTop: '15%'
          }}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.bottomContainer}>
          <View style={styles.editButtons}>
            <Text
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 16,
                fontWeight: 'bold'
              }}
            >
              u s e r n a m e
            </Text>
            <View>
              <EditUserModalForm />
            </View>
          </View>
          {user.id ? (
            <Text
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 16
              }}
            >
              {user.userName}
            </Text>
          ) : (
            <Text
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 16
              }}
            >
              P L A C E H O L D E R
            </Text>
          )}
          <ViewCrumsModal />
        </View>
        <View style={styles.buttons}>
          <LinearGradient
            style={styles.btnLogout}
            colors={['#19ae9f', '#26decb']}
          >
            <TouchableOpacity onPress={() => props.logout()}>
              <Text style={{color: 'white'}}>l o g o u t</Text>
            </TouchableOpacity>
          </LinearGradient>
          <UserSettingsModal style={styles.btnCrum} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    height: '100%',
    width: '100%',
    paddingBottom: '4%'
  },
  topContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    paddingBottom: '4%'
  },
  buttons: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  editButtons: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around'
  },
  btnLogout: {
    width: '47%',
    height: 60,
    backgroundColor: '#19ae9f',
    // textAlign: 'center',   // causes error  Failed prop type: Invalid props.style key `textAlign` supplied to `LinearGradient`.
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },

  input: {
    height: 60,
    width: '90%',
    borderRadius: 10,
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 2,
    alignItems: 'center',
    padding: 8,
    margin: 8
  }
})

const mapState = state => {
  return {
    user: state.user
    // totalCrums: state.user.totalCrums
  }
}

const mapDispatch = dispatch => {
  return {
    getSingleUser: id => dispatch(getSingleUser(id)),
    logout: () => dispatch(logout()),
    getUserCrumInstances: userId => {
      dispatch(fetchUserCrumInstances(userId))
    }
  }
}

export default connect(mapState, mapDispatch)(UserProfile)
