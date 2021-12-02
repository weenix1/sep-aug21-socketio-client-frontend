import { Container, Row, Col, Form, FormControl, ListGroup } from 'react-bootstrap'
import { useState, useEffect, FormEvent } from 'react'
import { io } from 'socket.io-client'

const ADDRESS = 'http://localhost:3030' // <-- address of the BACKEND PROCESS
const socket = io(ADDRESS, { transports: ['websocket'] })
// io establishes a connection with our backend socket.io process
// it takes the address we want to connect to, and optionally a configuration object
// in which we're asking to use straight the websocket protocol
// io returns the created connection (which is called "Socket")
// and we're assigning it to a variable because we're going to leverage
// methods and properties of this connection reference for listening to and emitting events
// EVERYTHING WE'RE GONNA DO IS GOING TO BE EVENT-BASED

// the second argument of io is for "connection options"
// transports is a property that will set which TECHNOLOGIES are we going to enable
// in our socket. By default the value of trasports is ["polling", "websocket"]

// CHAIN OF EVENTS/OPERATIONS:
// 1) CONNECT TO THE SERVER
// 2) SET YOUR USERNAME
// 3) ...

const Home = () => {
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  // every time this component renders, a connection gets established to the server
  // thanks to the io invocation at line 6

  // for checking the established connection, we can listen to an event coming from the server
  // because the server is told to emit a "welcome" event every time a client connects

  // how can we listen for an event coming from the server?
  // setting up a TRAP! (an event listener)

  useEffect(() => {
    // here we're setting up the traps, just once, because once set up they'll continue
    // working until the component is unmounted
    //
    // this trap is for the "connect" event coming from the server
    // the server is told to emit a "connect" event every time a new client connects

    socket.on('connect', () => {
      // we can listen here and execute code whenever a "connect" event comes towards our way!
      console.log('Connection established!')
    })

    // ONE TIME EXECUTED FUNCTION

    // now our client is able to successfully connect to the server. What's next?
    // now once we're connected, we can SET OUR USERNAME.

    // when the username is set, the backend will send me a "loggedin" event
    // let's set up a trap for it:
    socket.on('loggedin', () => {
      console.log("you're logged in!")
      // well done! let's set our interface as "logged in"
      setLoggedIn(true)
    })
  }, [])

  const handleUsernameSubmit = (e: FormEvent) => {
    e.preventDefault()
    // from here I want to send my username to the server
    // if "on()" on socket is for LISTENING for events, "emit()" is for SENDING an event
    socket.emit('setUsername', { username: username })
    // every time the server receives a username, it sends BACK an event to the client!
    // and that event is called "loggedin"
  }

  return (
    <Container fluid className='px-4'>
      <Row className='my-3' style={{ height: '95vh' }}>
        <Col md={10} className='d-flex flex-column justify-content-between'>
          {/* for the main chat window */}
          {/* 3 parts: username input, chat history, new message input */}
          {/* TOP SECTION: USERNAME INPUT FIELD */}
          <Form onSubmit={handleUsernameSubmit}>
            <FormControl
              placeholder='Insert your username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loggedIn}
            />
          </Form>
          {/* MIDDLE SECTION: CHAT HISTORY */}
          <ListGroup>
            <ListGroup.Item>Cras justo odio</ListGroup.Item>
            <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
            <ListGroup.Item>Morbi leo risus</ListGroup.Item>
            <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
            <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
          </ListGroup>
          {/* BOTTOM SECTION: NEW MESSAGE INPUT FIELD */}
          <Form>
            <FormControl
              placeholder='Insert your message here'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!loggedIn}
            />
          </Form>
        </Col>
        <Col md={2} style={{ borderLeft: '2px solid black' }}>
          {/* for the currently connected clients */}
          <div className='mb-3'>Connected users:</div>
          <ListGroup>
            <ListGroup.Item>Ubeyt</ListGroup.Item>
            <ListGroup.Item>Lidia</ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  )
}

export default Home
