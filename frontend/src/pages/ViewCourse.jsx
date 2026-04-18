/**
 * ============================================
 * VIEW COURSE - Course Detail Page
 * ============================================
 * Shows course info, curriculum (lectures), preview video, reviews, instructor
 * - Enroll: Razorpay payment → create-order → verify-payment → enrolls user
 * - checkEnrollment: Compares courseId with userData.enrolledCourses
 * - setSelectedCourseData: Finds course from courseData by courseId, stores in Redux
 */

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../App';
import { FaArrowLeftLong } from "react-icons/fa6";
import img from "../assets/empty.jpg"
import Card from "../components/Card.jsx"
import { setSelectedCourseData } from '../redux/courseSlice';
import { FaLock, FaPlayCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import { FaStar } from "react-icons/fa6";

// =========================
// AI Components
// =========================
const AiTutor = ({ courseId, courseTitle, courseDescription }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

   // courseId changes (user opens different course) → reset previous data
  useEffect(() => {
    setQuestion("")
    setAnswer("")
    setError("")
  }, [courseId])

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const res = await axios.post(
        `${serverUrl}/api/ai/ask`,
        {
          courseId,
          courseTitle,
          courseDescription,
          studentQuestion: question,
        },
        { withCredentials: true }
      );
      setAnswer(res.data.answer || "No answer received.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Something went wrong while asking the AI tutor."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-[1px]">
      <div className="rounded-2xl bg-slate-950/80 backdrop-blur-sm p-4 md:p-5 space-y-3 text-[var(--text)]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="inline-flex items-center text-[11px] uppercase tracking-[0.18em] text-[var(--primary2)] font-semibold mb-1">
              💬 Instant Help
            </p>
            <h3 className="text-lg font-semibold">AI Tutor – Ask Doubts</h3>
          </div>
        </div>
        <p className="text-sm text-[var(--muted)]">
          Ask anything about this course and get a clear, beginner‑friendly explanation from the AI tutor.
        </p>

        <textarea
          className="w-full border border-[var(--border)] rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary2)] bg-slate-900/80 text-[var(--text)]"
          rows={3}
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

      <button
          onClick={handleAsk}
          disabled={loading || !question.trim()}
        className="px-4 py-2 rounded-full bg-[var(--primary)] text-white text-sm hover:bg-[var(--primary2)] disabled:opacity-60 shadow-sm"
        >
          {loading ? "Asking AI..." : "Ask AI"}
        </button>

        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

        {answer && (
          <div className="mt-3 bg-slate-900/70 border border-[var(--border)] rounded-xl p-3 text-sm text-[var(--text)] whitespace-pre-wrap">
            {answer}
          </div>
        )}
      </div>
    </div>
  );
};

const AiFlashcards = ({ courseId, courseTitle, courseDescription }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

   // courseId changes → clear old flashcards
  useEffect(() => {
    setFlashcards([])
    setError("")
  }, [courseId])

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setFlashcards([]);

    try {
      const res = await axios.post(
        `${serverUrl}/api/ai/flashcards`,
        { courseId, courseTitle, courseDescription },
        { withCredentials: true }
      );
      setFlashcards(res.data.flashcards || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Something went wrong while generating flashcards."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-[1px]">
      <div className="rounded-2xl bg-slate-950/80 backdrop-blur-sm p-4 md:p-5 space-y-3 text-[var(--text)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="inline-flex items-center text-[11px] uppercase tracking-[0.18em] text-[var(--primary2)] font-semibold mb-1">
              ✨ Smart Revision
            </p>
            <h3 className="text-lg font-semibold">AI Flashcard Generator</h3>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 rounded-full bg-[var(--primary)] text-white text-sm hover:bg-[var(--primary2)] disabled:opacity-60 w-full sm:w-auto shadow-sm"
          >
            {loading ? "Generating..." : "Generate Flashcards"}
          </button>
        </div>
        <p className="text-sm text-[var(--muted)]">
          Get 5–8 quick Q/A flashcards to revise the key concepts of this course.
        </p>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {flashcards.length > 0 && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcards.map((card, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 border border-[var(--border)] rounded-xl p-3 text-sm flex flex-col gap-2 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--primary2)]">
                    Card {index + 1}
                  </p>
                  <span className="h-6 w-6 rounded-full bg-slate-900/70 text-[11px] flex items-center justify-center text-[var(--primary2)] font-semibold group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                    Q/A
                  </span>
                </div>
                <p className="font-semibold text-[var(--text)]">
                  {card.question}
                </p>
                <p className="text-[var(--muted)] bg-slate-950/70 border border-[var(--border)] rounded-lg px-2 py-1">
                  <span className="font-medium text-[var(--primary2)] mr-1">Answer:</span>
                  {card.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AiQuiz = ({ courseId, courseTitle, courseDescription }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

   // courseId changes → reset entire quiz
  useEffect(() => {
    setQuiz(null)
    setAnswers({})
    setSubmitted(false)
    setResult(null)
    setError("")
  }, [courseId])

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setQuiz(null);
    setAnswers({});
    setSubmitted(false);
    setResult(null);

    try {
      const res = await axios.post(
        `${serverUrl}/api/ai/quiz`,
        { courseId, courseTitle, courseDescription },
        { withCredentials: true }
      );
      setQuiz(res.data.quiz || null);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Something went wrong while generating the quiz."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionIndex, optionKey) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionKey,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!quiz?.questions?.length) return;

    const total = quiz.questions.length;
    let correct = 0;

    quiz.questions.forEach((q, index) => {
      if (answers[index] && answers[index] === q.correctAnswer) {
        correct += 1;
      }
    });

    setResult({
      correct,
      total,
      percentage: Math.round((correct / total) * 100),
    });
    setSubmitted(true);
  };

  const allAnswered =
    quiz?.questions &&
    quiz.questions.length > 0 &&
    Object.keys(answers).length === quiz.questions.length;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-[1px]">
      <div className="rounded-2xl bg-slate-950/80 backdrop-blur-sm p-4 md:p-5 space-y-3 text-[var(--text)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="inline-flex items-center text-[11px] uppercase tracking-[0.18em] text-[var(--primary2)] font-semibold mb-1">
              ✅ Check Your Understanding
            </p>
            <h3 className="text-lg font-semibold">AI Quiz Generator</h3>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 rounded-full bg-[var(--primary)] text-white text-sm hover:bg-[var(--primary2)] disabled:opacity-60 w-full sm:w-auto shadow-sm"
          >
            {loading ? "Generating..." : "Generate New Quiz"}
          </button>
        </div>
        <p className="text-sm text-[var(--muted)]">
          Create a 5-question multiple-choice quiz based on this course. Answer the questions,
          then let the AI instantly check how you did.
        </p>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {quiz?.questions && quiz.questions.length > 0 && (
          <div className="mt-3 space-y-4">
            {result && (
              <div className="rounded-xl border border-[var(--border)] bg-slate-900/70 px-3 py-2 text-sm flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[var(--primary2)]">
                    Score: {result.correct} / {result.total} ({result.percentage}%)
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {result.percentage === 100
                      ? "Perfect! You’ve mastered this set."
                      : result.percentage >= 70
                      ? "Great job! A quick review of the missed ones will make you solid."
                      : "Keep going—revisit the lectures and try again."}
                  </p>
                </div>
              </div>
            )}

            {quiz.questions.map((q, index) => {
              const selected = answers[index];
              const isCorrect = submitted && selected === q.correctAnswer;
              const isWrong = submitted && selected && selected !== q.correctAnswer;

              const optionEntries = [
                ["A", q.options?.A],
                ["B", q.options?.B],
                ["C", q.options?.C],
                ["D", q.options?.D],
              ];

              return (
                <div
                  key={index}
                  className="bg-slate-950 shadow-sm border border-[var(--border)] rounded-xl p-3 text-sm space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-[var(--text)]">
                      Q{index + 1}. {q.question}
                    </p>
                    {submitted && (
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isCorrect
                            ? "bg-slate-900/70 text-[var(--primary2)] border border-[var(--border)]"
                            : "bg-rose-950/40 text-rose-300 border border-rose-700"
                        }`}
                      >
                        {isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {optionEntries.map(([key, text]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectOption(index, key)}
                        className={`flex items-start gap-2 rounded-lg border px-2 py-2 text-left text-sm transition-all ${
                          selected === key
                            ? "border-[var(--primary)] bg-slate-900/60 text-[var(--text)]"
                            : "border-[var(--border)] hover:border-[var(--primary)] hover:bg-slate-900/40 text-[var(--muted)]"
                        } ${
                          submitted && key === q.correctAnswer
                            ? "border-[var(--primary)] bg-slate-900/60 text-[var(--text)]"
                            : ""
                        } ${
                          submitted &&
                          selected === key &&
                          key !== q.correctAnswer
                            ? "border-rose-500 bg-rose-950/40 text-[var(--text)]"
                            : ""
                        }`}
                      >
                        <span className="mt-[2px] text-xs font-semibold text-[var(--faint)]">
                          {key}.
                        </span>
                        <span>{text}</span>
                      </button>
                    ))}
                  </div>

                  {submitted && (
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      <span className="font-semibold text-[var(--text)] mr-1">AI Check:</span>
                      {isCorrect ? (
                        <>Nice work! You picked the right answer ({q.correctAnswer}).</>
                      ) : selected ? (
                        <>
                          Your answer was {selected}. The correct answer is{" "}
                          <span className="font-semibold">{q.correctAnswer}</span>.
                        </>
                      ) : (
                        <>
                          You skipped this one. The correct answer is{" "}
                          <span className="font-semibold">{q.correctAnswer}</span>.
                        </>
                      )}
                    </p>
                  )}
                </div>
              );
            })}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <p className="text-xs text-[var(--faint)]">
                Select an option for each question, then check your answers.
              </p>
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={!allAnswered || submitted}
                className="px-4 py-2 rounded-full bg-[var(--primary)] text-white text-sm hover:bg-[var(--primary2)] disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {submitted ? "Answers Checked" : "Check Answers with AI"}
              </button>
            </div>

            {submitted && quiz.feedback && (
              <div className="mt-2 bg-slate-900/70 border border-[var(--border)] rounded-xl p-3 text-sm text-[var(--text)]">
                <span className="font-semibold">AI Feedback: </span>
                {quiz.feedback}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function ViewCourse() {

      const { courseId } = useParams();
      const navigate = useNavigate()
    const {courseData} = useSelector(state=>state.course)
    const {userData} = useSelector(state=>state.user)
    const [creatorData , setCreatorData] = useState(null)
    const dispatch = useDispatch()
    const [selectedLecture, setSelectedLecture] = useState(null);
    const {lectureData} = useSelector(state=>state.lecture)
    const {selectedCourseData} = useSelector(state=>state.course)
  const [selectedCreatorCourse,setSelectedCreatorCourse] = useState([])
   const [isEnrolled, setIsEnrolled] = useState(false);
   const [rating, setRating] = useState(0);
   const [comment, setComment] = useState("");
   
   
  


  const handleReview = async () => {
    try {
      const result = await axios.post(serverUrl + "/api/review/givereview" , {rating , comment , courseId} , {withCredentials:true})
      toast.success("Review Added")
      console.log(result.data)
      setRating(0)
      setComment("")

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to submit review")
    }
  }
  

  const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / reviews.length).toFixed(1); // rounded to 1 decimal
};

// Usage:
const avgRating = calculateAverageRating(selectedCourseData?.reviews);
console.log("Average Rating:", avgRating);

  

  const fetchCourseData = async () => {
    courseData.map((item) => {
      if (item._id === courseId) {
      dispatch(setSelectedCourseData(item))
        console.log(selectedCourseData)
      

        return null;
      }

    })

  }
  const checkEnrollment = () => {
  const verify = userData?.enrolledCourses?.some(c => {
    const enrolledId = typeof c === 'string' ? c : c._id;
    return enrolledId?.toString() === courseId?.toString();
  });
  console.log("Enrollment verified:", verify);
  // always set true or false — not just true
  // previously if verify was false, setIsEnrolled never ran → stayed true from previous course
  setIsEnrolled(verify || false)
};

useEffect(() => {
  // reset first so AI components unmount → their state clears → fresh for new course
  setIsEnrolled(false)
  fetchCourseData()
  checkEnrollment()
}, [courseId, courseData, lectureData])


    // Fetch creator info once course data is available
  useEffect(() => {
    const getCreator = async () => {
      if (selectedCourseData?.creator) {
        try {
          const result = await axios.post(
            `${serverUrl}/api/course/getcreator`,
            { userId: selectedCourseData.creator },
            { withCredentials: true }
          );
          setCreatorData(result.data);
          console.log(result.data)
        } catch (error) {
          console.error("Error fetching creator:", error);
        }
      }
    };

    getCreator();

    
  }, [selectedCourseData]);


   


  useEffect(() => {
  if (creatorData?._id && courseData.length > 0) {
    const creatorCourses = courseData.filter(
      (course) =>
        course.creator === creatorData._id && course._id !== courseId // Exclude current course
    );
    setSelectedCreatorCourse(creatorCourses);
  
  }
}, [creatorData, courseData]);

 
const handleEnroll = async (courseId, userId) => {
  try {
    // 1. Create Order
    const orderData = await axios.post(serverUrl + "/api/payment/create-order", {
      courseId,
      userId
    } , {withCredentials:true});
    console.log(orderData)

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // from .env
      amount: orderData.data.amount,
      currency: "INR",
      name: "AceDesk",
      description: "Course Enrollment Payment",
      order_id: orderData.data.id,
      handler: async function (response) {
  console.log("Razorpay Response:", response);
  try {
    const verifyRes = await axios.post(serverUrl + "/api/payment/verify-payment",{
  ...response,       
  courseId,
  userId
}, { withCredentials: true });
    
setIsEnrolled(true)
    toast.success(verifyRes.data.message);
  } catch (verifyError) {
    toast.error("Payment verification failed.");
    console.error("Verification Error:", verifyError);
  }
  },
    };
    
    const rzp = new window.Razorpay(options)
    rzp.open()

  } catch (err) {
    toast.error("Something went wrong while enrolling.");
    console.error("Enroll Error:", err);
  }
};

  return (
     <div className="min-h-screen bg-[var(--bg)] p-6 text-[var(--text)]">
      <div className="max-w-6xl mx-auto bg-[var(--surface)] shadow-md rounded-xl p-6 space-y-6 relative border border-[var(--border)]">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-6 ">
             
          {/* Thumbnail */}
          <div className="w-full md:w-1/2">
             <FaArrowLeftLong  className='text-[var(--text)] w-[22px] h-[22px] cursor-pointer' onClick={()=>navigate("/")}/>
            {selectedCourseData?.thumbnail ? <img
              src={selectedCourseData?.thumbnail}
              alt="Course Thumbnail"
              className="rounded-xl w-full object-cover"
            /> :  <img
              src={img}
              alt="Course Thumbnail"
              className="rounded-xl  w-full  object-cover"
            /> }
          </div>

          {/* Course Info */}
          <div className="flex-1 space-y-2 mt-[20px]">
            <h1 className="text-2xl font-bold text-[var(--text)]">{selectedCourseData?.title}</h1>
            <p className="text-[var(--muted)]">{selectedCourseData?.subTitle}</p>

            {/* Rating & Price */}
            <div className="flex items-start flex-col justify-between">
              <div className="text-yellow-500 font-medium">
                ⭐ {avgRating} <span className="text-[var(--muted)]">(1,200 reviews)</span>
              </div>
              <div>
                <span className="text-lg font-semibold text-[var(--text)]">₹{selectedCourseData?.price}</span>{" "}
                <span className="line-through text-sm text-[var(--faint)]">₹599</span>
              </div>
            </div>

            {/* Highlights */}
            <ul className="text-sm text-[var(--muted)] space-y-1 pt-2">
              <li>✅ 10+ hours of video content</li>
              <li>✅ Lifetime access to course materials</li>
              
            </ul>

            {/* Enroll Button */}
            {!isEnrolled ?<button className="bg-[var(--primary)] text-white px-6 py-2 rounded hover:bg-[var(--primary2)] mt-3 shadow-sm" onClick={()=>handleEnroll(courseId , userData._id)}>
              Enroll Now
            </button> :
            <button className="bg-slate-900/70 text-[var(--text)] px-6 py-2 rounded hover:bg-slate-900 border border-[var(--border)] mt-3 shadow-sm" onClick={()=>navigate(`/viewlecture/${courseId}`)}>
             Watch Now
            </button>
            }
          </div>
        </div>

        {/* What You'll Learn */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-[var(--text)]">What You’ll Learn</h2>
          <ul className="list-disc pl-6 text-[var(--muted)] space-y-1">
            <li>Learn {selectedCourseData?.category} from Beginning</li>
            
          </ul>
        </div>

        {/* Requirements */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-[var(--text)]">Requirements</h2>
          <p className="text-[var(--muted)]">Basic programming knowledge is helpful but not required.</p>
        </div>

        {/* Who This Course Is For */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-[var(--text)]">Who This Course is For</h2>
          <p className="text-[var(--muted)]">
            Beginners, aspiring developers, and professionals looking to upgrade skills.
          </p>
        </div>

        {/* course lecture   */}
        <div className="flex flex-col md:flex-row gap-6">
  {/* Left Side - Curriculum */}
  <div className="bg-[var(--surface)] w-full md:w-2/5 p-6 rounded-2xl shadow-lg border border-[var(--border)]">
    <h2 className="text-xl font-bold mb-1 text-[var(--text)]">Course Curriculum</h2>
    <p className="text-sm text-[var(--muted)] mb-4">{selectedCourseData?.lectures?.length} Lectures</p>

    <div className="flex flex-col gap-3">
      {selectedCourseData?.lectures?.map((lecture, index) => (
        <button
          key={index}
          disabled={!lecture.isPreviewFree}
          onClick={() => {
            if (lecture.isPreviewFree) {
              setSelectedLecture(lecture);
            }
          }}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${
            lecture.isPreviewFree
              ? "hover:bg-slate-900 cursor-pointer border-[var(--border)]"
              : "cursor-not-allowed opacity-60 border-[var(--border)]"
          } ${
            selectedLecture?.lectureTitle === lecture.lectureTitle
              ? "bg-slate-900/70 border-[var(--primary)]"
              : ""
          }`}
        >
          <span className="text-lg text-[var(--muted)]">
            {lecture.isPreviewFree ? <FaPlayCircle /> : <FaLock />}
          </span>
          <span className="text-sm font-medium text-[var(--text)]">
            {lecture.lectureTitle}
          </span>
        </button>
      ))}
    </div>
  </div>

  {/* Right Side - Video + Info */}
  <div className="bg-[var(--surface)] w-full md:w-3/5 p-6 rounded-2xl shadow-lg border border-[var(--border)]">
    <div className="aspect-video w-full rounded-lg overflow-hidden mb-4 bg-black flex items-center justify-center">
      {selectedLecture?.videoUrl ? (
        <video
          src={selectedLecture.videoUrl}
          controls
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-white text-sm">Select a preview lecture to watch</span>
      )}
    </div>

    <h3 className="text-lg font-semibold text-[var(--text)] mb-1">
      {selectedLecture?.lectureTitle || "Lecture Title"}
    </h3>
    <p className="text-[var(--muted)] text-sm">
      {selectedCourseData?.title}
    </p>
  </div>
</div>

{/* AI Learning Tools - Only for enrolled users */}
<div className="mt-10 border-t pt-6 space-y-5">
  <h2 className="text-xl md:text-2xl font-semibold">AI Learning Tools</h2>

  {!isEnrolled && (
    <div className="rounded-xl border border-[var(--border)] bg-slate-900/60 px-4 py-3 text-sm text-[var(--muted)]">
      🔒 Please <strong>enroll in this course</strong> to unlock AI Tutor, Flashcards, and Quiz features.
    </div>
  )}
  
  {isEnrolled && (
    <>
      <AiTutor
        courseId={courseId}
        courseTitle={selectedCourseData?.title}
        courseDescription={selectedCourseData?.description || selectedCourseData?.subTitle}
      />

      <AiFlashcards
        courseId={courseId}
        courseTitle={selectedCourseData?.title}
        courseDescription={selectedCourseData?.description || selectedCourseData?.subTitle}
      />

      <AiQuiz
        courseId={courseId}
        courseTitle={selectedCourseData?.title}
        courseDescription={selectedCourseData?.description || selectedCourseData?.subTitle}
      />
    </>
  )}
</div>

<div className="mt-8 border-t pt-6">
    <h2 className="text-xl font-semibold mb-2">Write a Review</h2>
    <div className="mb-4">
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
         
            <FaStar  key={star}
            onClick={() => setRating(star)} className={star <= rating ? "fill-yellow-500" : "fill-gray-300"} />
         
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment here..."
        className="w-full border border-[var(--border)] rounded-lg p-2 bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--muted)]"
        rows="3"
      />
      <button
        
        className="bg-[var(--primary)] text-white mt-3 px-4 py-2 rounded-md hover:bg-[var(--primary2)] shadow-sm" onClick={handleReview}
      >
        Submit Review
      </button>
    </div>

        {/* Instructor Info */}
        <div className="flex items-center gap-4 pt-4 border-t ">
          {creatorData?.photoUrl ?<img
            src={creatorData?.photoUrl}
            alt="Instructor"
            className="w-16 h-16 rounded-full object-cover"
          />: <img
            src={img}
            alt="Instructor"
            className="w-16 h-16 rounded-full object-cover"
          />
          }
          <div>
            <h3 className="text-lg font-semibold">{creatorData?.name}</h3>
            <p className="md:text-sm text-gray-600 text-[10px] ">{creatorData?.description}</p>
            <p className="md:text-sm text-gray-600 text-[10px] ">{creatorData?.email}</p>
            
          </div>
        </div>
        <div>
          <p className='text-xl font-semibold mb-2'>Other Published Courses by the Educator -</p>
        <div className='w-full transition-all duration-300 py-[20px]   flex items-start justify-center lg:justify-start flex-wrap gap-6 lg:px-[80px] '>
          
            {
                selectedCreatorCourse?.map((item,index)=>(
                    <Card key={index} thumbnail={item.thumbnail} title={item.title} id={item._id} price={item.price} category={item.category}/>
                ))
            }
        </div>
      </div>
    </div>
    </div>
    </div>
  )
}

export default ViewCourse
