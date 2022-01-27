import React from 'react'
import { useState, useEffect } from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import axios from 'axios'

const Contents = () => {

    const [confirmedData, setConfirmedData] = useState({})
    const [qurantinedData, setQurantinedData] = useState({})
    const [comparedData, setComparedData] = useState({})

    useEffect(() => {
        const fetchEvents = async () => {
            const res = await axios.get("https://api.covid19api.com/dayone/country/kr")  //순차적인 진행을 위해 async
            makeData(res.data)
        }
        const makeData = (items) => {
            // items.forEach(item => console.log(item)) //forEach를 통해 각각의 Object를 가져온다
            const arr = items.reduce((acc, cur) => {
                const currentDate = new Date(cur.Date);
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const date = currentDate.getDate();
                const confirmed = cur.Confirmed
                const active = cur.Active
                const death = cur.Death
                const recoverd = cur.Recoverd
                // console.log(cur, year, month , date )
                // console.log(death,recoverd)

                const findItem = acc.find(a => a.year === year && a.month === month)
                if (!findItem) {
                    acc.push(
                        { year: year, month: month, date: date, confirmed: confirmed, active: active, death: death, recoverd: recoverd }
                    )
                }
                if (findItem && findItem.date < date) {
                    findItem.active = active;
                    findItem.death = death;
                    findItem.date = date;
                    findItem.year = year;
                    findItem.month = month;
                    findItem.recoverd = recoverd;
                    findItem.confirmed = confirmed;
                }
                return acc;
            }, [])

            const labels = arr.map(a => `${a.year} ${a.month + 1}월`);

            setConfirmedData(
                {
                    labels,
                    datasets: [
                        {
                            label: "국내 누적 확진자",
                            backgroundColor: "salmon",
                            fill: true,
                            data: arr.map(a => a.confirmed)
                        },
                    ]
                });

            setQurantinedData(
                {
                    labels, // 월별 
                    datasets: [
                        {
                            label: "월별 격리자 현황",
                            borderColor: "salmon",
                            fill: false,
                            data: arr.map(a => a.active)
                        },
                    ]
                });

            const last = arr[arr.length-1];
            // console.log(last)

            
            setComparedData(
                {
                    labels : ["확진자","격리자"], 
                    datasets: [
                        {
                            label: "확진자 ,격리자",
                            backgroundColor:["#ff3d67","#059bff","#ffc233"],
                            borderColor: ["#ff3d67","#059bff","#ffc233"],
                            fill: false,
                             data: [last.active, last.confirmed,]
                            
                        },
                    ]
                });


        }
        fetchEvents()
    }, [])               /// 두번쨰 파라미터에 [] 추가하여 계속해서 값을 받아오지 않는다



    return (
        <section>
            국내 코로나 현황
            <div className="contents">
                <div>
                    <Bar data={confirmedData} options={
                        { title: { display: true, text: "누적 확진자 추이", fontSize: 16 } }, //제목 옵션
                        { legend: { display: true, position: "bottom" } } //legend => 차트 
                    }></Bar>
                </div>

                <div>
                    <Line data={qurantinedData} options={
                        { title: { display: true, text: "월별 격리자 현황", fontSize: 16 } }, //제목 옵션
                        { legend: { display: true, position: "bottom" } } //legend => 차트 
                    }></Line>
                </div>

                {/* <div className="doughnut">
                    <Doughnut data={comparedData} options={
                        { title: { display: true, text: `현재 누적 확진, 해제, 사망${new Date().getMonth() + 1}월`, fontSize: 16 } }, //제목 옵션
                        { legend: { display: true, position: "bottom" } } //legend => 차트 
                    }></Doughnut>
                </div> */}
            </div>
        </section>
    )
}

export default Contents
