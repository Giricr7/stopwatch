import React, { useState, useEffect,useRef } from 'react';
import {MdOutlineTimelapse,MdOutlineDeleteOutline} from 'react-icons/md'

function Stopwatch() {

    //state variables
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [timerOn, setTimerOn] = useState(false);
    const [lap, setLap] = useState([]);

    // reference variables
    const secondsRef = useRef(0);
    const minutesRef = useRef(0);
    

    // actions to be performed once the page is loaded
    useEffect(() => {
        if (localStorage.getItem('lap'))
        {
            let lapLog = localStorage.getItem('lap').split(',')
            setLap([...lapLog]);
            
        }
        if (localStorage.getItem('lastLog')) {
            let [hr, min, sec] = localStorage.getItem('lastLog').split(':');
            setHours(+hr);
            setMinutes(+min);
            setSeconds(+sec);
        }

    }, [])


    //action to be performed when there is a state change in the array 'lap'
    useEffect(() => {
        if(lap.length)
        localStorage.setItem('lap', lap)
    },[lap])


    // actions to be performed on clicking start,stop,reset buttons
    useEffect(() => {
        let secInterval = null;


        if (timerOn) {
           
            secInterval = setInterval(() => {
                setSeconds((prevSec) => {
                    
                    if (prevSec !== 59) {
                        return prevSec + 1
                    }
                    else { return 0 }
                    
                });
               
                if (secondsRef.current / 59 === 1) {
                    setMinutes((prevMin) => {
                        if (prevMin !== 60) { return prevMin + 1 }
                        else { return 0 }
                    });
                }

                if (minutesRef.current / 59 === 1 && secondsRef.current / 59 === 1) {
                    setHours((prevHr) => prevHr + 1);
                }
                
            }, 1000);
            
            
        } else if (!timerOn) {
            clearInterval(secInterval);
        }
        
        return () => {
            clearInterval(secInterval)
        }
    }, [timerOn])
    

    //action to be performed when there is a state change in the variable 'seconds'  
    useEffect(() => {
        secondsRef.current = seconds;
        localStorage.setItem('lastLog', `${hours}:${minutes}:${seconds}`);
        if(+(localStorage.getItem('lastLog').split(':')[2])>0)
           { setTimerOn(true)}
        
    }, [seconds])
    
    //action to be performed when there is a state change in the variable 'minute'
    useEffect(() => {
        minutesRef.current = minutes;
    },[minutes])

    // action performed when clicking the reset button
    let ResetTimer = () => {
        localStorage.clear();
        setTimerOn(false);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        setLap([]);
    }


    // fetching the laps stored in localstorage
    let SetLap =  () => {
    
        let lapsedTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        setLap([...lap,lapsedTime])
        
    }

    // deleting a particular lap log
    let deleteLog = (index) => {
        
        let filteredLap = lap.filter((val,i) => {
            return i !== index;
        })

        setLap(filteredLap);
        localStorage['lap'] = filteredLap;

    }

  return (
      <div id='content_div'>
          
          {/* clock section */}
          <div id='clock_div'>
              <span>{hours<10?'0':''}{hours}<sub>HH</sub> :</span>
              <span>&nbsp;{minutes<10?'0':''}{minutes}<sub>MM</sub> :</span>  
              <span>&nbsp;{seconds<10?'0':''}{seconds}<sub>SS</sub></span>
          </div>
          <br/><br/><br/>
          
          {/* lap section  */}
          <div id='lap_div'>
          <MdOutlineTimelapse id='lap_icon'/>
          <div >              
          <div className='laps_innerdiv'>
                      {lap.length ? lap.map((time, index) =>

                          <>
                            <div className='laps' key={index}>
                                <p id='lap_heading' >LAP { index+1 }</p>
                                <p  id='lap_value' >{time}</p>
                                    <MdOutlineDeleteOutline
                                        id='delete_icon'
                                        onClick={() => deleteLog(index)}
                                        key={'icon'+index}
                                    />  
                                    </div>
                                &nbsp;&nbsp;&nbsp;&nbsp;    
                              </>):<h2>Lap log empty</h2>}
                    
                  
          </div>
          </div> 
          </div>
          <br/><br/><br/><br/>

            {/* button section  */}
          <div id='button_div'>
              <button className='buttons'
                  style={{
                      background: timerOn ? 'black' : '#cff4f8',
                      color: timerOn ? 'white' : 'black'
                  }}
                  onClick={() => setTimerOn(true)}>Start</button>&nbsp;&nbsp;
              <button className='buttons'
                  style={{
                      background: !timerOn ? 'black' : '#cff4f8',
                      color: !timerOn ? 'white' : 'black'
                  }}
                  onClick={() => setTimerOn(false)}>Stop</button>&nbsp;&nbsp;
              <button className='buttons' onClick={() => ResetTimer()}>Reset</button>&nbsp;&nbsp;
              {timerOn && <button className='buttons' onClick={() => SetLap()}>Lap</button>}
          </div>
      </div>
  )
}

export default Stopwatch