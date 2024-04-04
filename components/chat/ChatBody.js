import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Dropdown, FormControl, InputGroup, Nav } from 'react-bootstrap';
import CommandListBottom from './command/CommandListBottom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import supabase from '../../supabase';
import axios from 'axios';
import CommandInChat from './command/CommandInChat';
import CommandInChatSingle from './command/CommandInChatSingle';
import Faqs from './Faqs';

function ChatBody(props) {
  const {
    selectedRoom,
    initialFetchComplete,
    isTyping,
    typeChat,
    userCredit,
    userData,
    isLoading,
    setSelectedRoom,
    setIsLoading,
    setIsTyping
  } = props
  const avatarUrl = process.env.NEXT_PUBLIC_AVATAR_URL;
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedRoom) {      
      const fetchContentMessage = async () => {
        try {
          const response = await axios.get('/api/chat/message', {
              params: {
              id: selectedRoom
            }
          });
          if (response.status === 201) {
            setMessages(response.data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      fetchContentMessage();
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (initialFetchComplete) {
      const channel = supabase
        .channel('realtime message')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'message' }, handleMessageInserted)
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, [initialFetchComplete, selectedRoom]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  const handleMessageInserted = (payload) => {
    const { new: newMessage } = payload
    if (selectedRoom === newMessage.thread_room_id) {
      setMessages((prevMessage) => [...prevMessage, newMessage])
      scrollToBottom();
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    try {
      setIsLoading(true);
      setInputText(''); 
      if (typeChat === 0) {
        const response = await axios.post('/api/chat/sending/bot', { 
          text: inputText, 
          sender: 'user', 
          room_id: selectedRoom,
        });
        if (response.status === 200) {
          setSelectedRoom(selectedRoom)
          setInputText('');
          setIsLoading(false);
          toast.success(response.data.message);
        }
      } else if(typeChat === 1) {
        const response = await axios.post('/api/chat/ai', { 
          text: inputText, 
          sender: 'user', 
          thread_id: toThreadId, 
          room_id: selectedRoom,
          assistant_id:  toAssistantId
        });
        if (response.status === 200) {
          setSelectedRoom(selectedRoom)
          setInputText('');
          setIsLoading(false);
          toast.success(response.data.message);
        }
      }
      
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  function formatOutput(message) {
    const splitMessage = message.split('\n');
    const fileDescriptions = splitMessage.slice(0, -2);
    const footer = splitMessage.slice(-2).join('\n');

    const linkRegex = /(?:\[([^\]]+)\]\((https?:\/\/[^\)]+)\))|(\((https?:\/\/[^\)]+)\))/g;  // Regex untuk mencocokkan tautan dalam format [teks](URL) / () hanya jika ada http atau https

    // Fungsi untuk mengganti tautan dalam pesan
    const renderMessage = (text) => {
       // Mengganti tautan dengan format <a href="URL" target="_blank" rel="noopener noreferrer">teks</a>
      text = text.replace(linkRegex, (match, text1, url1, text2, url2) => {
        if (url1 && text1) {
          return `<a href="${url1}" target="_blank" rel="noopener noreferrer">${text1}</a>`;
        } else if (url2) {
          return `<a href="${url2}" target="_blank" rel="noopener noreferrer">${url2}</a>`;
        }
      });

      // Membuat teks yang diapit oleh ** menjadi tebal
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      return text;
      };

    return (
      <div>
        <ul>
          {fileDescriptions.map((fileDescription, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: renderMessage(fileDescription) }} />
          ))}
        </ul>
        <p dangerouslySetInnerHTML={{ __html: renderMessage(footer) }} />
      </div>
    );
  }

  return (
    <Col sm={12} md={12} lg={12} xxl={8}>
      <Card>
        <div className="main-content-app pt-0">
          <div className="main-content-body main-content-body-chat h-100">
            <div className="main-chat-header pt-3 d-block d-sm-flex">
              <div className="main-img-user online"><img alt="avatar" src={"../../../assets/images/legalnowy.png"} /></div>
              <div className="main-chat-msg-name mt-2">
                <h6>Legalnowy</h6>
              </div>
              <Nav>
                <div className="">
                  <InputGroup>
                    <FormControl type="text" placeholder="Search ..." />
                    <InputGroup.Text className="btn bg-white text-muted border-start-0"><i className="fe fe-search"></i></InputGroup.Text>
                  </InputGroup>
                </div>
                <Dropdown>
                  <Dropdown.Toggle className="text-muted fs-20 no-caret" as="a"><i className="fe fe-more-horizontal mx-3"></i></Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu-end">
                    <Dropdown.Item href="#!"><i className="fe fe-phone-call me-1"></i> Phone Call</Dropdown.Item>
                    <Dropdown.Item href="#!"><i className="fe fe-video me-1"></i> Video Call</Dropdown.Item>
                    <Dropdown.Item href="#!"><i className="fe fe-user-plus me-1"></i> Add Contact</Dropdown.Item>
                    <Dropdown.Item href="#!"><i className="fe fe-trash-2 me-1"></i> Delete</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </div>
            {/* <!-- main-chat-header --> */}
            <div className="main-chat-body flex-2" id="ChatBody">
              <PerfectScrollbar containerRef={ref => { messagesEndRef.current = ref; }}>
                <div className="content-inner">
                  {messages.map((msg, index) => (
                    <div key={index}>
                    {msg.role ===  'system' || msg.role === 'assistant' ? (
                      <div className="media chat-left">
                        <div className="main-img-user online"><img alt="avatar" src={"../../../assets/images/legalnowy.png"} /></div>
                        <div className="media-body">
                          <div className="main-msg-wrapper">
                              <div>
                                {formatOutput(msg.content)}
                                {msg.command_id && msg.command_show && msg.initial_command === 1 ? (
                                    <Faqs commandId={msg.command_id} roomId={selectedRoom} setIsTyping={setIsTyping}/>
                                ) : msg.command_show && msg.initial_command === 0 ? (
                                    <CommandInChat roomId={selectedRoom} setIsTyping={setIsTyping}/>
                                ) : msg.command_show && msg.initial_command === 2 ? (
                                    <CommandInChatSingle roomId={selectedRoom} setIsTyping={setIsTyping} commandId={msg.command_id}/>
                                ) : (
                                    <></>
                                )}
                              </div>
                          </div>
                          <div>
                            <span>{msg.created_at}</span> <Link href=""><i className="icon ion-android-more-horizontal"></i></Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="media flex-row-reverse chat-right mb-2">
                        <div className="main-img-user online"><img alt="avatar" src={userData?.photo ? avatarUrl+userData?.photo : "../../../assets/images/users/21.jpg"} /></div>
                        <div className="media-body">
                          <div className="main-msg-wrapper">
                          <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                          </div>
                          <div>
                            <span>{msg.created_at}</span> <Link href=""><i className="icon ion-android-more-horizontal"></i></Link>
                          </div>
                        </div>
                      </div>
                    )}
                    </div>
                  ))}
                  {isTyping && (
                    <div>
                      <div className="media chat-left mt-2">
                        <div className="main-img-user online"><img alt="avatar" src={"../../../assets/images/legalnowy.png"} /></div>
                        <div className="media-body">
                          <div className="main-msg-wrapper">
                            <div>
                              <span className="spinner-grow text-success me-2" style={{ width: '10px', height: '10px' }} ></span>
                              <span className="spinner-grow text-success me-2 text-danger" style={{ width: '10px', height: '10px' }} ></span>
                              <span className="spinner-grow text-success me-2 text-warning" style={{ width: '10px', height: '10px' }} ></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </PerfectScrollbar>
            </div>
            <CommandListBottom typeChat={typeChat} credit={userCredit} roomId={selectedRoom} senderName={userData?.sun} userId={userData?.sud}/>
            <div className="main-chat-footer">
              <input className="form-control" placeholder="Type your message here..." type="text"  value={inputText} onChange={(e) => setInputText(e.target.value)} />
              <Link className="nav-link" data-bs-toggle="tooltip" href="" title="Attach a File"><i className="fe fe-paperclip"></i></Link>
              {isLoading ? (
                <div>
                  <span className="spinner-grow text-success me-2" style={{ width: '10px', height: '10px' }} ></span>
                  <span className="spinner-grow text-success me-2 text-danger" style={{ width: '10px', height: '10px' }} ></span>
                  <span className="spinner-grow text-success me-2 text-warning" style={{ width: '10px', height: '10px' }} ></span>
                </div>
              ) : ( 
                <>
                  <Button className="btn btn-icon  btn-primary brround"  onClick={handleSendMessage}><i className="fa fa-paper-plane-o"></i></Button>
                  <nav className="nav">
                  </nav>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Col>
  )
}

export default ChatBody