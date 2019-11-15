import React from 'react';
import { StyleSheet, Text, TextInput, View, Button,FlatList, ProgressBarAndroid, ScrollView, ToastAndroid } from 'react-native';
import ReactDOM from 'react-dom';
import DatePicker from 'react-native-datepicker';
import t from 'tcomb-form-native';

const Form = t.form.Form;
let now = new Date();

export default class HelloWorldApp extends  React.Component {
  constructor(props) {
    super(props);
    this.state = {
        clearToWrite: true,
        pos : 0,
        eventList: [{
          key:"preouther",
          startDate:  now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate(),
          endDate:  now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()
        }],
        text: '',
        startDate: now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate(),
        endDate: now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()
    };

    this.changeendDate = this.changeendDate.bind(this);
    this.setText = this.setText.bind(this)
    this.setStartDate = this.setStartDate.bind(this);
    this.onAddItem = this.onAddItem.bind(this);
    this.suppItem = this.suppItem.bind(this);
    this.dateCalculation = this.dateCalculation.bind(this);
    this.showToast = this.showToast.bind(this);
  }

  showToast = () => {
    ToastAndroid.showWithGravityAndOffset(
      "Cet évènement existe déjà",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };

  changeendDate(date) {
      this.setState({ endDate: date});
  }

  setText(text) {
    this.setState({ text:text});
  }

  setStartDate(date) {
    this.setState({ startDate:date});
  }

  dateCalculation(startdate, enddate) {
    date1 = new Date(startdate);
    date2 = new Date(enddate);

    var totalDifference_In_Days = (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24);
    var todayDifference_In_Days = (new Date().getTime() - date1.getTime()) / (1000 * 3600 * 24);

    var percent = ((todayDifference_In_Days * 100) / totalDifference_In_Days);

    if (percent > 100) {
        return 1;
    }
    else {
        if (percent < 0) { return 0.0 }
        return percent / 100;
    }
  }
  
  onAddItem = () => {
    let clearToWrite = true;
    this.state.eventList.forEach(element => {
      if (element.key == this.state.text && element.endDate == this.state.endDate && element.startDate == this.state.startDate) {
        this.showToast();
        clearToWrite = false;
      }
    });
    
    if(clearToWrite == true) {
      const obj = {key: this.state.text, startDate: this.state.startDate, endDate:this.state.endDate};
      this.setState(state => {
        eventList = state.eventList.concat(obj);
        return {
          eventList
        };
      });
    }else {clearToWrite = true;}
  };

  suppItem = (key) => {
    this.setState(state => {
      eventList = state.eventList.filter(item => item.key !== key);
      return {
        eventList
      };
    });
  };

    render() {
      return (
        
        <View style={{padding: 35}}>
          <TextInput
            style={{height: 40}}
            placeholder="Write the name of your event !"
            onChangeText={text => this.setText(text)}
            value={this.state.text}
          />
        <DatePicker date={this.state.startDate} onDateChange={date => this.setStartDate(date)}/>
        <DatePicker date={this.state.endDate} onDateChange={date => this.changeendDate(date)} minDate={this.state.startDate}/>
        <Button
            title="Press me"
            onPress={() => this.onAddItem()}
          />
           <ScrollView style={{padding: 20}}>
            <FlatList
              data={this.state.eventList}
              renderItem={({item}) => (
                <View>
                  <Text style={styles.item}>{item.key} ({item.endDate}) </Text>
                  <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={this.dateCalculation(item.startDate, item.endDate)} />
                  <View style={styles.fixToText}>
                    <Button length='40' color='red' title="Supprimer"
                    onPress={() => this.suppItem(item.key)}/>
                  </View>
                </View>
              )}
            />
          </ScrollView>
        </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },  
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
