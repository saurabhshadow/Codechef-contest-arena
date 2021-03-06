import React, { Component } from 'react'
import {
  Table,

} from 'reactstrap';

import correct from '../img/correct.png'
import compile from '../img/compile.png'
import runtime from '../img/runtime.png'
import timelimit from '../img/timelimit.png'
import wrong from '../img/wrong.png'
import Countdown from "react-countdown";
import Utils from './utils'
import './button.css'


const url = Utils.config.urlBase
const urlProblem = Utils.config.urlMain
const userUrl=  Utils.config.urlMain
class Problems extends Component {
  constructor (props) {
    super(props)
    this.state = {
      contestCode: this.props.contestCode,
      contestName: '',
      problems: [],
      problemName:'',
      ContestDuration:9000,
      activity:[],
    }
  }

  componentDidMount () {
    const contestUrl = url + '/contests/' + this.state.contestCode+'?sortBy=successfulSubmissions&sortOrder=desc'
    var token = window.localStorage.access_token
    const self = this
    Utils.getSecureRequest(contestUrl, token, function (err, res) {
      if (!err) {
        const start= new Date(res.startDate).getTime();
        const end=new Date(res.endDate).getTime();
        const duration=end-start;
        self.setState({ contestName: res.name, contestCode: res.code, problems: res.problemsList, ContestDuration: duration})

      } else {
        window.alert(res)
      }
    })

    const recentsubmissionUrl= url+'/submissions/?contestCode='+this.state.contestCode
    Utils.getSecureRequest(recentsubmissionUrl, token, function (err, res) {
      if (!err) {

        self.setState({activity:res})


      } else {
        window.alert(res)
      }
    })


  }



  render () {


    const renderer = ({ hours, minutes, seconds, completed }) => {
      if (completed) {
        window.location='/';

      } else {

        return (
            <div style={{fontSize:18}}>
                <div style={{fontFamily: 'monospace'}}>
                  Contest Ends in
                </div>
                <div style={{fontSize:18}}>
                    <span>{hours}:{minutes}:{seconds}</span>
                </div>
            </div>
        );
      }
    };


    var items = null
    if (this.state.problems && this.state.problems.length > 0) {
      items = this.state.problems.map(function (i) {
        return (
          <tr key={i.problemCode}>
            <td>
              <a
                href={'/contests/'+i.contestCode+'/problems/'+i.problemCode}
                >
                {i.problemCode}
              </a>
            </td>
            <td> {i.problemCode} </td>
            <td> {i.successfulSubmissions} </td>
            <td> {parseFloat(i.accuracy).toFixed(2)} </td>
          </tr>
        )
      })
    }

    var submissionlist=null
    if(this.state.activity && this.state.activity.length > 0){
      submissionlist=this.state.activity.map(function(i)   {

        return(

          <tr key={i.id}>
            <td style={{fontSize:15}}>{i.date}</td>
            <td style={{fontSize:15}}><a target='_blank' href= {userUrl+'/users/'+i.username}>{i.username}</a></td>
            <td style={{fontSize:15,fontWeight: '500'}}>{i.problemCode}</td>
            <td style={{fontSize:15}}>
              {(() => {

                if (i.result === 'AC') {
                  return (
                    <img src={correct} style={{height:20,width:20}}/>
                  )
                }
                else if(i.result ==='RE'){
                  return(
                    <img src={runtime} style={{height:20,width:20}}/>
                  )
                }
                else if(i.result ==='WA'){
                  return(
                    <img src={wrong} style={{height:20,width:20}}/>
                  )
                }
                else if(i.result ==='TLE'){
                  return(
                    <img src={timelimit} style={{height:20,width:20}}/>
                  )
                }
                else{
                  return(
                    <img src={compile} style={{height:20,width:20}}/>
                  )
                }

              })()}

             </td>
            <td style={{fontSize:12,fontWeight: '100'}}>{i.language}</td>
          </tr>
        )
      })
    }

    var problemsView = <div style={{ justifyContent: 'center', marginTop: 100 }}>
      <div>
        <Table bordered>
          <thead>
            <tr>
              <th > Name </th>
              <th> Code </th>
              <th> Successful submissions </th>
              <th> Accuracy </th>
            </tr>
          </thead>
          <tbody>
            {items}
          </tbody>
        </Table>
      </div>
    </div>


    var recentActivity = <div style={{justifyContent:'center',marginTop:10}}>
      <div>
        <p style={{marginTop:30,fontFamily: 'AvenirNext-UltraLightItalic'}}>Recent Activity</p>
        <Table bordered size="sm">
          <thead>
            <tr>
              <th style={{fontSize:15}}> Date </th>
              <th style={{fontSize:15}}> User </th>
              <th style={{fontSize:15}}> Problem Code </th>
              <th style={{fontSize:15}}> Result </th>
              <th style={{fontSize:15}}> Laungauge </th>
            </tr>
          </thead>
          <tbody>
            {submissionlist}
          </tbody>
        </Table>
      </div>
    </div>



    return (

      <div>

        <p style={{textAlign: 'center', justifyContent: 'center',fontSize: 20,marginTop:60,fontWeight:'400',fontFamily: 'BradleyHandITCTT-Bold'}}><u>{this.state.contestName}</u></p>
        <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}>


            <div style={{ width: '60%' }}>
            {problemsView}
            </div>

            <div style={{textAlign: 'center', justifyContent: 'center',fontSize: 20,marginTop: 50,  marginLeft: 40,}}>
                    <Countdown date={Date.now() + this.state.ContestDuration} renderer={renderer} />
                    <button  className="button button2" style={{marginTop:30}}  onClick={() =>  {Utils.moveTo(`/ranklist/${this.state.contestCode}`)  }}>Contest Ranklist</button>
                    {recentActivity}

            </div>




        </div>


      </div>


    )
  }
}

export default Problems
