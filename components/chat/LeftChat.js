import React, { useEffect, useState } from 'react'
import { Button, Card, Col, FormControl, InputGroup, Nav, Tab } from 'react-bootstrap'
import PerfectScrollbar from 'react-perfect-scrollbar';
import axios from 'axios';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import supabase from '../../supabase';

function LeftChat(props) {
  const {
    userData,
    userCredit,
    selectedRoom,
    setSelectedRoom,
    setToAssistantId,
    setToThreadId,
    setTypeChat,
    // initialFetchComplete,
    setReciverName,
    setReciverPhoto,
    setSenderName,
    setSenderPhoto,
    setChatAgent,
    setTimeChatAgent,
    setAgentResponse,
    setRoomBy
  } = props
  const avatarContactUrl = process.env.NEXT_PUBLIC_AVATAR_CONTACT_URL;
  const [dataContact, setDataContact] = useState([]);
  const [activeTab, setActiveTab] = useState(''); // state for active tab
  const [defaultActiveTab, setDefaultActiveTab] = useState('msg'); // state for default active tab
  const avatarUrl = process.env.NEXT_PUBLIC_AVATAR_URL;
  const [sideMessage, setSideMessage] = useState([]);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);

  useEffect(() => {
    if (userData) {
      const fetchSideMessage = async () => {
        try {
          if (userData?.role === 'Users') {            
            const response = await axios.get('/api/chat/sidemsg', {
                params: {
                id: userData?.sud
              }
            });
            if (response.status === 201) {
              setInitialFetchComplete(true);
              setSideMessage(response.data);
            }
          } else {
            const response = await axios.get('/api/chat/sidemsg', {
                params: {
                id: userData?.group_id
              }
            });
            if (response.status === 201) {
              setInitialFetchComplete(true);
              setSideMessage(response.data);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      fetchSideMessage();
    }
  }, [userData]);

  useEffect(() => {  
    const fetchContact = async () => {
      try {
        const response = await axios.get('/api/chat/contact');
        if (response.status === 201) {
          setDataContact(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchContact();
  }, []);

  // realtime side message room
  useEffect(() => {
    if (initialFetchComplete) {
      const channel = supabase
        .channel('realtime thread')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'thread' }, handleRoomInserted)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'thread' }, handleRoomUpdated)
        .subscribe()

      return () => {
        channel.unsubscribe();
      };
    }
  }, [initialFetchComplete]);

  const handleRoomInserted = (payload) => {
    const { new: newRoom } = payload
    if (userData?.role === 'Users') {      
      if (newRoom.room_by === userData?.sud) {
        setSideMessage((prevRooms) => [...prevRooms, newRoom])
      }
    } else {
      if (newRoom.reciver_group === userData?.group_id) {
        setSideMessage((prevRooms) => [...prevRooms, newRoom])
      }
    }
  }

  const handleRoomUpdated = (payload) => {
    const { new: updatedRoom } = payload
    if (updatedRoom && updatedRoom.last_message && updatedRoom.id) {
      setSideMessage((prevRooms) => {
        return prevRooms.map((room) => {
          if (room.id === updatedRoom.id) {
            return {
              ...room,
              last_message: updatedRoom.last_message,
              updated_at: updatedRoom.updated_at,
              agent_response: updatedRoom.agent_response,
              start_chat_agent: updatedRoom.start_chat_agent,
              time_chat_agent: updatedRoom.time_chat_agent
            }
          }
          
          return room

        })
      })
    }
  }

  const handleRoomSelection = (roomId, threadId, assistantsId, typechat, reciverName, reciverPhoto, senderName, senderPhoto, chatAgent, chatTimeAgent, agentResponse, roomBy) => {
    setReciverName(reciverName);
    setReciverPhoto(reciverPhoto);
    setSenderName(senderName);
    setSenderPhoto(senderPhoto);
    setSelectedRoom(roomId);
    setToAssistantId(assistantsId);
    setToThreadId(threadId);
    setTypeChat(typechat);
    setChatAgent(chatAgent);
    setAgentResponse(agentResponse)
    setTimeChatAgent(chatTimeAgent);
    setRoomBy(roomBy);
  };

  const clickContact = async (reciverName, assistantId, reciverGroup, reciverPhoto) => {
    try {     
      const response = await axios.post('/api/chat/create', {
        room_by: userData?.sud,
        new_assistant_id: assistantId,
        sender_name: userData?.sun,
        sender_photo: userData?.photo,
        reciver_name: reciverName,
        assistant_id: assistantId,
        reciver_group: reciverGroup,
        reciver_photo: reciverPhoto
      });
      if (response.status === 201) {
        setReciverName(response.data.reciver_name);
        setReciverPhoto(response.data.reciver_photo);
        setSelectedRoom(response.data.room_id);
        setActiveTab('msg');
        setTypeChat(response.data.type_chat);
        setToAssistantId(response.data.assistant_id);
        toast.success('Create room successfully')
      }
    } catch (error) {
      toast.error('Something when wrong!')
    }
  }

  // Mendefinisikan fungsi untuk mengubah format tanggal
  function formatDateTime(dateTimeString) {
    const options = {
      hour: 'numeric',
      minute: 'numeric'
    };

    const date = new Date(dateTimeString);
    const currentDate = new Date();
    const yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(currentDate.getDate() - 1);

    const isToday = date.getDate() === currentDate.getDate() &&
                    date.getMonth() === currentDate.getMonth() &&
                    date.getFullYear() === currentDate.getFullYear();

    const isYesterday = date.getDate() === yesterdayDate.getDate() &&
                        date.getMonth() === yesterdayDate.getMonth() &&
                        date.getFullYear() === yesterdayDate.getFullYear();

    if (isToday) {
      return 'Today ' + date.toLocaleTimeString('en-US', options);
    } else if (isYesterday) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', options);
    } else {
      const formatDate = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);

      return formatDate;
    }
  }

  return (
    <Col sm={12} md={12} lg={12} xxl={4}>
      <Card className="overflow-hidden">
        <div className="main-content-app pt-0 main-chat-2">
          <PerfectScrollbar>
            <div className="main-content-left main-content-left-chat">
              <Card.Body className="d-flex align-items-center">
                <div className="main-img-user online">
                  {userData && userData.photo ? (
                      <img alt="avatar" src={avatarUrl+userData.photo} />
                    ) : (
                      <div className="avatar avatar-md brround bg-primary-transparent text-primary">{userData?.sun.trim().charAt(0)}</div>
                  )}
                </div>
                <div className="main-chat-msg-name">
                  <h6>{userData?.sun}</h6>
                  {userData?.role === 'Users' && (
                    <>
                      <span className={`dot-label ${userCredit === 0 ? 'bg-danger' : 'bg-success'}`}></span><small className="me-3">Your Credit ({userCredit})</small>
                    </>
                  )}
                </div>
              </Card.Body>

              <Card.Body>
                <InputGroup>
                  <FormControl type="text" placeholder="Search ..." />
                  <Button variant="primary" className="input-group-text">Search</Button>
                </InputGroup>
              </Card.Body>

              <Tab.Container id="left-tabs-example" activeKey={activeTab || defaultActiveTab} onSelect={(key) => setActiveTab(key)}>
                <Nav variant="pills" className="px-4" >
                  <Nav.Item>
                    <Nav.Link eventKey="msg">Messages</Nav.Link>
                  </Nav.Item>
                  {userData?.role !== 'Super Admin' && userData?.role !== 'Manager' && (
                  <Nav.Item>
                    <Nav.Link eventKey="cnts">Contacts</Nav.Link>
                  </Nav.Item>
                  )}
                </Nav>
                <Tab.Content className=' main-chat-list flex-2 mt-2'>
                  {userData?.role === 'Users' ? (
                    <Tab.Pane eventKey="msg">
                      <div className="main-chat-list tab-pane">
                        {sideMessage && sideMessage.length > 0 ? (
                          sideMessage.map((sidemsg, index) => (
                            <Link  className={`media ${sidemsg.id === selectedRoom ? 'selected' : ''}`} href="#!" key={index} 
                            onClick={() => handleRoomSelection(
                              sidemsg.id, 
                              sidemsg.thread_id,
                              sidemsg.assitants_id, 
                              sidemsg.type_chat, 
                              sidemsg.reciver_name, 
                              sidemsg.reciver_photo, 
                              sidemsg.sender_name, 
                              sidemsg.sender_photo, 
                              sidemsg.start_chat_agent, 
                              sidemsg.time_chat_agent, 
                              sidemsg.agent_response
                            )}
  >
                              <div className="main-img-user online"><img alt="user9" src={sidemsg.reciver_photo ? avatarContactUrl+sidemsg.reciver_photo : "../../../assets/images/legalnowy.png"} /></div>
                              <div className="media-body">
                                <div className="media-contact-name">
                                  <span>{sidemsg.reciver_name}</span> <span>{formatDateTime(sidemsg.updated_at)}</span>
                                </div>
                                <p dangerouslySetInnerHTML={{ __html: sidemsg.last_message }} className='text-truncate' style={{ maxHeight: '35px'}}/>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <p className='text-center text-muted'>No message available.</p>
                        )}
                      </div>
                    </Tab.Pane>
                  ) : (
                    <Tab.Pane eventKey="msg">
                      <div className="main-chat-list tab-pane">
                        {sideMessage && sideMessage.length > 0 ? (
                          sideMessage.map((sidemsg, index) => (
                            <Link  className={`media ${sidemsg.id === selectedRoom ? 'selected' : ''}`} href="#!" key={index} 
                            onClick={() => handleRoomSelection(
                              sidemsg.id, 
                              sidemsg.thread_id, 
                              sidemsg.assitants_id, 
                              sidemsg.type_chat, 
                              sidemsg.reciver_name, 
                              sidemsg.reciver_photo, 
                              sidemsg.sender_name, 
                              sidemsg.sender_photo, 
                              sidemsg.start_chat_agent, 
                              sidemsg.time_chat_agent, 
                              sidemsg.agent_response, 
                              sidemsg.room_by
                            )}> 
                                {sidemsg.sender_photo ? (
                                  <div className="main-img-user">
                                    <img alt={sidemsg.sender_name} src={avatarUrl+sidemsg.sender_photo} />
                                  </div>
                                ) : (
                                  <span className="avatar avatar-md brround bg-danger-transparent text-danger">{sidemsg.sender_name.charAt(0)}</span>
                                )}
                              <div className="media-body">
                                <div className="media-contact-name">
                                  <span>{sidemsg.sender_name}</span> <span>{formatDateTime(sidemsg.updated_at)}</span>
                                </div>
                                <p dangerouslySetInnerHTML={{ __html: sidemsg.last_message }} className='text-truncate' style={{ maxHeight: '35px'}}/>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <p className='text-center text-muted'>No message available.</p>
                        )}
                      </div>
                    </Tab.Pane>
                  )}
                  {userData?.role !== 'Super Admin' && userData?.role !== 'Manager' && (
                    <Tab.Pane eventKey="cnts">
                      <div>
                        {dataContact && dataContact.length > 0 ? (
                          dataContact.map((contact, index) => (
                          <div className="d-flex align-items-center media" onClick={() => clickContact(contact.group_name, contact.ai_group, contact.id, contact.group_photo)} key={index}>
                            <div className="mb-0 me-2">
                              {contact.group_photo ? (
                                <div className="main-img-user">
                                  <img alt="user3" src={avatarContactUrl+contact.group_photo} />
                                </div>
                              ) : (
                                <span className="avatar avatar-md brround bg-danger-transparent text-danger">{contact.group_name.charAt(0)}</span>
                              )}
                            </div>
                            <div className="align-items-center justify-content-between">
                              <div className="media-body ms-2">
                                <div className="media-contact-name">
                                  <span>{contact.group_name}</span>
                                  <span></span>
                                </div>
                              </div>
                            </div>
                            {/* <div className="ms-auto">
                              <i className="contact-status text-primary fe fe-message-square me-2"></i>
                              <i className="contact-status text-success fe fe-phone-call me-2"></i>
                              <i className="contact-status text-danger fe fe-video me-2"></i>
                            </div> */}
                          </div>
                          ))
                        ) : (
                          <p className='text-center text-muted'>No contact available.</p>
                        )}
                      </div>
                    </Tab.Pane>
                  )}
                </Tab.Content>
              </Tab.Container>
            </div>
          </PerfectScrollbar>
        </div>
      </Card>
    </Col>
  )
}

export default LeftChat