import {connect} from 'react-redux'
import * as React from 'react'
import {SCALER} from './utils'
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert
} from 'react-native'
import {imageThumbnails} from '../../assets/'
import {postCrumInstance, getSingleUser} from '../store/'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
class DisDropCrumForm extends React.Component {
  constructor() {
    super()
    this.handleTypeMessage = this.handleTypeMessage.bind(this)
    this.handleDropCrum = this.handleDropCrum.bind(this)
  }
  state = {
    modalVisible: true,
    message: '',
    imgId: ''
  }
  setModalVisible(modalVisible) {
    this.setState({
      modalVisible: modalVisible
    })
  }
  handleTypeMessage(event) {
    this.setState({
      message: event.nativeEvent.text
    })
  }
  async handleDropCrum(crumInstance, userId, crumId) {
    await this.props.dropCrumInstance(crumInstance, userId, crumId)
    this.props.getSingleUser(userId)
  }
  render() {
    const {locations, crums, user, hideDropCrumForm} = this.props
    return (
      <View style={styles.container}>
        {/* <TouchableOpacity
          style={styles.btnDrop}
          onPress={() => {
            this.setModalVisible(true)
          }}
        >
          <Text style={{color: '#19ae9f'}} title="Drop!">
            d r o p
          </Text>
        </TouchableOpacity> */}
        <Modal
          // style={styles.root}
          style={{flex: 1}}
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            // this.handleOpenModel()
            Alert.alert('Modal closed')
          }}
        >
          <SafeAreaView style={{flex: 1}}>
            <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
              <View style={{flex: 1}}>
                <View style={styles.modal}>
                  <View style={styles.modalPngSelector}>
                    {crums.map(crum => (
                      <TouchableOpacity
                        key={crum.id}
                        onPress={() => {
                          console.log('you selected this crum')
                          this.setState({
                            imgId: crum.id
                          })
                        }}
                      >
                        <Image
                          style={{width: 40, height: 40, margin: 6}}
                          borderColor="gray"
                          borderWidth={this.state.imgId === crum.id ? 2 : 0}
                          borderRadius={3}
                          source={imageThumbnails[crum.name]}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.modalInput}>
                    <TextInput
                      required
                      id="message"
                      value={this.state.message}
                      onChange={this.handleTypeMessage}
                      textAlign="center"
                      style={styles.input}
                      placeholder="m e s s a g e"
                      autoComplete="message"
                      type="text"
                    />

                    {/* <TextInput
                  required
                  id="tags"
                  value={this.state.message}
                  onChange={this.handleTypeMessage}
                  textAlign="center"
                  style={styles.input}
                  placeholder="tags"
                  autoComplete="message"
                  type="text"
                /> */}
                  </View>

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={styles.btnDrop}
                      onPress={() => {
                        this.handleDropCrum(
                          {
                            message: this.state.message,
                            latitude: locations.latitude,
                            longitude: locations.longitude
                          },
                          user.id,
                          this.state.imgId
                        )
                        this.props.hideDropCrumForm()
                        this.setModalVisible(!this.state.modalVisible)
                      }}
                    >
                      <Text style={{color: '#19ae9f'}} title="Drop!">
                        drop
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btnDrop}
                      onPress={() => {
                        hideDropCrumForm()
                        this.setModalVisible(!this.state.modalVisible)
                      }}
                    >
                      <Text style={{color: '#19ae9f'}} title="Drop!">
                        never mind
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        </Modal>
      </View>
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
  crumInstances: state.crumInstances,
  crums: state.crums
})
const mapDispatch = dispatch => {
  return {
    dropCrumInstance: (crumInstance, userId, crumId) => {
      dispatch(postCrumInstance(crumInstance, userId, crumId))
    },
    getSingleUser: id => {
      dispatch(getSingleUser(id))
    }
  }
}

const DropCrumForm = connect(mapState, mapDispatch)(DisDropCrumForm)

export default DropCrumForm

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  modal: {
    // height: '100%',
    // position: 'relative',
    display: 'flex',
    width: '93%',
    flexDirection: 'column',
    backgroundColor: 'rgba(250,250,250,0.8)',
    borderColor: '#7c1e9f',
    alignSelf: 'center',
    shadowColor: 'grey',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 10,
    marginBottom: '10%',
    marginTop: '20%',
    padding: 5
  },
  modalPngSelector: {
    display: 'flex',
    width: '100%',
    flexBasis: '80%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderColor: 'gray',
    borderWidth: 1
  },
  modalButtons: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexBasis: '16%',
    display: 'flex',
    flexDirection: 'row',
    borderColor: 'gray',
    borderWidth: 1
  },
  btnDrop: {
    display: 'flex',
    height: 60,
    flex: 3,
    flexBasis: '30%',
    backgroundColor: 'white',
    borderColor: '#19ae9f',
    borderWidth: 2,
    textAlign: 'center',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  },
  modalInput: {
    justifyContent: 'center',
    flexBasis: '16%',
    display: 'flex',
    borderColor: 'gray',
    borderWidth: 1
  },
  input: {
    height: 60,
    borderRadius: 10,
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 2,
    alignItems: 'center',
    margin: 5
  }
})
