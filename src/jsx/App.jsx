import React, {Component} from 'react'
import style from './../styles/styles.less';

import CountUpElement from './CountUpElement.jsx';

// https://alligator.io/react/axios-react/
import axios from 'axios';

// https://github.com/joshwcomeau/react-flip-move
import FlipMove from 'react-flip-move';

// https://underscorejs.org/
import _ from 'underscore';

let country_prev_data = {};
let interval;
class App extends Component {
  constructor() {
    super();
    this.state = {
      data:false,
      date:0,
      dates:0
    }
  }
  componentDidMount() {
    axios.get('./data/data.json', {
    })
    .then((response) => {
      this.setState((state, props) => ({
        data:response.data,
        dates:_.keys(response.data['Finland']).filter((value, index, arr) => {
          return !(value === 'Country' || value === 'Continent' || value === 'Province/State' || value === 'Lat' || value === 'Long');
        })
      }));
      interval = setInterval(() => {
        if (this.state.date >= (this.state.dates.length - 1)) {
          clearInterval(interval);
        }
        else {
          this.setState((state, props) => ({
            date:state.date + 1
          }));
        }
      }, 800);
    });
  }
  componentWillUnMount() {
    clearInterval(interval);
  }
  render() {
    let countries  = [];
    let html = [];
    let items = [];
    let max = 0;
    let date = [];
    _.each(this.state.data, (data, country) => {
      let bar_style;
      if (data[this.state.dates[this.state.date]] > 0) {
        items.push({
          bar_style:{width:data[this.state.dates[this.state.date]] + '%'},
          country:country,
          end:data[this.state.dates[this.state.date]],
          img_src:'./img/' + country + '.png',
          start:country_prev_data[country]
        });
        country_prev_data[country] = data[this.state.dates[this.state.date]];
      }
      else if (country_prev_data[country]) {
        items.push({
          bar_style:{width:data[this.state.dates[this.state.date]] + '%'},
          country:country,
          end:country_prev_data[country],
          img_src:'./img/' + country + '.png',
          start:country_prev_data[country]
        });
      }
    });
    items = _.sortBy(items, (item) => { return -item.end; }).slice(0,11);
    if (items[0]) {
      max = Math.log10(items[0].end + 1);
      date = this.state.dates[this.state.date].split('/');
      date = date[1] + '.' + date[0] + '.' + date[2] + '20';
    }
    return (
      <div className={style.app}>
        <h3 className={style.date}>{date}</h3>
        <FlipMove typeName="ul">
          {items.map(item => (
            <li key={item.country} className={style.bar_container}><span className={style.bar} style={{width: + ((Math.log10(item.end + 1) / max) * 100) + '%'}}><span className={style.value}><CountUpElement start={item.start} end={item.end} /></span></span><span className={style.country_name}><img src={item.img_src} alt="" /> {item.country}</span></li>
          ))}
        </FlipMove>
      </div>
    );
  }
}
export default App;