import axios from 'axios';

const url = 'http://localhost:5000/api/posts/';

class PostService {
    // Get Posts 
    static async getPosts() {
        const res = await axios.get(url)
        try {
          var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', time: 'numeric' };
          const data = res.data
          return data.map(post => ({
            ...post,
            time: new Date(post.time).toLocaleString("en-US", options) + "   " + new Date(post.time).toLocaleTimeString(),
            createdAt: new Date(post.createdAt)
          }))
        } catch (err) {
          return err
        }
    }

    // Get Posts 
    static async getMostRecentTemperature() {
        const res = await axios.get(url)
        try {
          var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', time: 'numeric' };
          var greatestDate = res.data[0].time;
          var result = '';
          res.data.forEach((element) => {
            if(element.time >= greatestDate){
                greatestDate = element.time;
                element.time = new Date(element.time).toLocaleString("en-US", options) + "   " + new Date(element.time).toLocaleTimeString()
                result = element;
            }
          });    
          return result;
        } catch (err) {
          return err
        }
    }    

    // Create Post 
    static insertPost(city, time, temp, tempType) {
        return axios.post(url, {
            city, time, temp, tempType
        });
    }

    // Delete Post 
    static deletePost(id) {
        return axios.delete(`${url}${id}`);
    }
}

export default PostService;