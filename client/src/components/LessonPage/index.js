import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Typography, useTheme } from '@mui/material';
import { tokens } from "../../theme";
import PracticeQuestion from "./practiceQuestion";
import MiddleBar from "./middleBar";
import ThirdBar from "./thirdBar";
import EditLessonModal from "./editLessonModal";
import SharingModal from "./shareLessonModal";
import axios from "axios";
import {API_URL} from '../../config';
import { toast } from 'react-toastify';

const LessonPage = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { lesson_id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [views, setViews] = useState(0);
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [citation, setCitation] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [lessonSections, setLessonSections] = useState(null);
  const [lessonPracticeQuestions, setLessonPracticeQuestions] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleEditModal = () => {
    if(!loading){
      setIsEditModalOpen(!isEditModalOpen);
    }
  };
  const toggleShareModal = () => {
    if(!props.user){
      toast.error("Log in to share lessons.");
    }
    else if(!loading){
      setIsShareModalOpen(!isShareModalOpen);
    }
  };

  const makeLessonReq = (url) => {
    let data = JSON.stringify({
      "lesson_id": lesson_id,
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: url,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    return config;
  }

  const fetchAuthor = async (id) => {
    if (id) {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${API_URL}/getDBUserDetails`,
        headers: { 
            'Content-Type': 'application/json'
        },
        params : {
            id: id
        }
      };
      axios.request(config)
      .then((response) => {
          setAuthor(response.data);
      })
      .catch((error) => {
          console.log(error);
      });
    }
  }

  const fetchLessonDetails = async () => {
    const lessonDetailsReq = makeLessonReq(`${API_URL}/lesson`)
    axios.request(lessonDetailsReq)
    .then((response) => {
      setTitle(response.data.lesson[0].title);
      setDescription(response.data.lesson[0].description);
      setViews(response.data.lesson[0].view_count);
      setDate(response.data.lesson[0].created_at);
      setCitation(response.data.lesson[0].citation);
      setIsPublic(response.data.lesson[0].is_public);
      fetchAuthor(response.data.lesson[0].user_id);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const fetchLessonSections = () => {
    const lessonSectionsReq = makeLessonReq(`${API_URL}/lessonSections`);
    axios.request(lessonSectionsReq)
    .then((response) => {
      setLessonSections(response.data.lesson);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const fetchLessonPracticeQuestions = () => {
    const practiceQuestionsReq = makeLessonReq(`${API_URL}/lessonPracticeQuestions`);
    axios.request(practiceQuestionsReq)
    .then((response) => {
      setLessonPracticeQuestions(response.data.lesson);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const recordLessonView = () => {
    let data = JSON.stringify({
      "lesson_id": lesson_id,
      "viewer_id": props.user?.id || ""
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${API_URL}/lessons/${lesson_id}/view`,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    axios.request(config)
    .catch((error) => {
      console.log(error);
    });
  }

  const fetchLessonData = async () => {
    setLoading(true); // Start loading

    try {
        await Promise.all([
            fetchLessonDetails(),
            fetchLessonSections(),
            fetchLessonPracticeQuestions()
        ]);
    } catch (error) {
        console.error("Error fetching lesson data:", error);
    } finally {
        setLoading(false); // Stop loading
    }
};

  useEffect(() => {
    recordLessonView();
    fetchLessonData();
  }, []);

  return (
    <>
      {!loading &&
        <>
          <MiddleBar isCollapsed={props.isCollapsed} author={author} date={date} citation={citation}/>
          <ThirdBar user={props.user} lessonId={lesson_id} views={views} isPublic={isPublic} toggleEditModal={toggleEditModal} toggleShareModal={toggleShareModal}/>
          <EditLessonModal 
            open={isEditModalOpen} 
            onClose={toggleEditModal} 
            lesson={{ lesson_id, title, description, lessonSections, lessonPracticeQuestions, citation, isPublic }} 
            isLessonLoaded={!loading}
            onLessonSubmit={fetchLessonData}
          />
          <SharingModal 
            open={isShareModalOpen} 
            onClose={toggleShareModal} 
            lessonId={lesson_id}
            user={props.user}
          />

          <Grid container style={{ marginTop: 45, maxWidth: '80%', margin: 'auto' }} spacing={4}>
            <Grid item xs={12}>
              <div style={{borderBottom: `1px solid ${colors.blueAccent[100]}`, marginBottom: '40px', marginTop: -40}}>
                <Typography variant="h1" style={{ marginBottom: '10px' }}>
                  {title.toUpperCase()}
                </Typography>
              </div>

              <Typography variant="h3" style={{marginBottom: '10px', fontWeight: 'bold'}}>
                Key Concepts:
              </Typography>
              <ul style={{ marginBottom: '50px', borderBottom: `1px solid ${colors.blueAccent[100]}`, paddingBottom: 25, listStyleType: 'none' }} >
                  {lessonSections &&
                    lessonSections.map((section, index) => (
                      <li key={index} style={{ lineHeight: '2', fontSize: '18px', marginBottom: '10px' }}>
                        <span style={{ color: colors.blueAccent[100], marginRight: '20px', fontWeight: 'bold' }}>•</span>{section.title}
                      </li>
                    ))
                  }
              </ul>

              <Typography variant="body1" style={{ marginBottom: '40px', fontSize: '18px', lineHeight: '2.5', textIndent: '30px' }}>
                {description}
              </Typography>
            </Grid>

            {lessonSections &&
              lessonSections.map((section) => (
                <Grid item key={section.id} xs={12} style={{ marginBottom: '40px', fontSize: '18px' }}>
                  <div style={{borderBottom: `1px solid ${colors.blueAccent[100]}`, marginBottom: '40px'}}>
                    <Typography variant="h2" style={{marginBottom: '10px', fontWeight: 'bold'}}>
                      {section.title}
                    </Typography>
                  </div>
                  <Typography variant="body1" style={{ lineHeight: '2.5', fontSize: '18px', textIndent: '30px' }}>
                    {section.body}
                  </Typography>
                </Grid>
              ))
            }

            <Grid item xs={12} style={{ marginBottom: '40px', fontSize: '18px' }}>
              <div style={{borderBottom: `1px solid ${colors.blueAccent[100]}`, marginBottom: '40px'}}>
                <Typography variant="h2" style={{marginBottom: '10px', fontWeight: 'bold'}}>
                  Practice Questions
                </Typography>
              </div>
              {lessonPracticeQuestions &&
                lessonPracticeQuestions.map((question) => (
                  <PracticeQuestion key={question.id} question={question} />
                ))
              }
            </Grid>
          </Grid>
        </>
      }
    </>
  );
};

export default LessonPage;