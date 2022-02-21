<template>
  <div class="containerPrime">
    <div class="containerInput">
      <h1>Please Input Your Temperature Details</h1>
      <div class="inputStyling">
        <div class="row" align="left">
          <div class="column" style="margin-bottom:13px">
            <label for="city">Enter the city:</label>
          </div>
          <div class="column" style="margin-bottom:13px">
            <label for="date-time">Enter the date and time:</label>
          </div>
          <div class="column" style="margin-bottom:13px">
            <label for="temp">Enter the temperature:</label>
          </div>
        </div>
      </div>
      &nbsp;&nbsp;
      <div class="inputStyling">
        <form v-on:submit.prevent="createPost" method="createPost">
          <div class="row" align="left">
            <div class="column" style="margin-bottom:8px">
              <input type="text" id="city" v-model="city" style="width:195px" placeholder="Enter City" required>
              <div>{{ this.error.city }}</div>
            </div>     
            <div class="column" style="margin-bottom:8px">
              <input type="datetime-local" id="date-time-picker" v-model="time" placeholder="Enter date and time" class="spacing" required>   
            </div>
            <div class="column" style="margin-bottom:8px">
              <input type="number" id="temp" v-model="temp" style="width:195px" placeholder="Enter Temperature" required>  
              <select id="tempType" v-model="tempType" style="margin-left:8px" required>
                <option value="" selected disabled hidden>Select Temperature Type</option>
                <option value="celsius">Celsius</option>
                <option value="fahrenheit" md-selected>Fahrenheit </option>
              </select>    
            </div> 
            <div class="column" style="margin-bottom:25px">
              <button v-on:click="createPost">Create!</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    &nbsp;&nbsp;
    <div class="containerOutput">
      <h3>Most Recent Temperature</h3>
      <hr class="positionLine">
      <p class="error" v-if="error">{{ error }}</p>
      <div class="posts-container">
        <div class="post">
          {{recentTemp.time}}
          <p class="text">{{ recentTemp.city }}&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{{ recentTemp.temp }}{{ recentTemp.tempType }}</p>
          <p></p>
        </div>
      <h3 margin-top="50px">All Temperatures</h3>
      <hr class="positionLine">       
        <div class="post"
          v-for="(post, index) in posts"
          v-bind:item="post"
          v-bind:index="index"
          v-bind:key="post._id"
          v-on:dblclick="deletePost(post._id)">
          {{post.time}}
          <p class="text">{{ post.city }}&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{{ post.temp }}{{ post.tempType }}</p>
          <p></p>
        </div>
      </div>       
    </div>
  </div>
</template>

<script>
import PostService from '../PostService'

export default {
  name: 'PostComponent',
  data() {
    return {
      posts: [],
      recentTemp: '',
      error: '',
      time: '',
      temp: '',
      tempType: '',
      city: ''
    }
  },
  async created() { 
    try {
      this.posts = await PostService.getPosts();
      this.recentTemp = await PostService.getMostRecentTemperature();
      document.getElementById("date-time-picker").max = ((new Date()).toISOString().split('.')[0].substring(0,16)).toString();
    } catch(err) { 
      this.error = err.message;
    }
  },
  methods: {    
    async createPost() {
      if(this.city == null || this.city == ''){
        return;
      }
      if(this.time == null || this.time == ''){
        return;
      }
      if(this.temp == null || this.temp == ''){
        return;
      }
      if(this.tempType == null || this.tempType == ''){
        return;
      }
      if(this.tempType == 'celsius'){
        this.tempType = '°C'
      } 
      else if(this.tempType == 'fahrenheit') {
        this.tempType = '°F'
      }
      window.location.reload();
      await PostService.insertPost(this.city, this.time, this.temp, this.tempType);
      this.posts = await PostService.getPosts();
      this.recentTemp = await PostService.getMostRecentTemperature();
    },
    async deletePost(id) {
      await PostService.deletePost(id);
      this.posts = await PostService.getPosts();
      this.recentTemp = await PostService.getMostRecentTemperature();
    }
  }
}
</script>

<style scoped>
  div.containerPrime {
    width: 1600px; 
    margin: auto;
  }

  div.containerInput {
    display: inline-block;
    width: 700px; 
    border: 1px solid #020202;
    vertical-align: top;
  }

  div.containerOutput {
    display: inline-block;
    width: 700px; 
    border: 1px solid #020202;
  }  
  
  div.inputStyling {
    display: inline-block;
    vertical-align: top;
  }    

  p.error {
    border: 1px solid #ff5b5f;
    background-color: #ffc5c1;
    padding:0% 10px;
    margin-bottom: 15px;
  }

  div.post {
    position: relative; 
    border: 1px solid #58c3d6;
    background-color: #b8d7ff;
    padding: 10px 10px 30px 10px; 
    margin-bottom: 15px; 
  }

  div.created-at {
    position: absolute;
    top: 0;
    left: 0;
    padding: 5px 15px 5px 15px;
    background-color: darkgreen; 
    color: white;  
    font-size: 13px;
  }

  p.text {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 0;
  }

  hr.positionLine {
    position: relative;
    top: -15px;
  }  
</style>
