<template>
  <div id="app" class="app">
    <div class="app-header">
      <p>Please choose your preferred Stock ISIN</p>
      <select v-model="subscribe" @change="unsubscribe">
        <option v-for="item in stocksList" :key="item.isin" :value="item">{{item.name}}</option>
      </select>
      <button @click="handleChange" :disabled="!isNewIsinSelected && !isUnsubscribed">Subscribe</button>
    </div>
    <div class="app-hero">
      <p>You are receiving a continuous updates for</p>
      <div class="app-hero-title">
        <h1>{{subscribe.name}}</h1>
        <small>{{subscribe.isin}}</small>
      </div>
      <button :disabled="isNewIsinSelected || isUnsubscribed" @click="unsubscribe">Unsubscribe</button>
    </div>

    <div class="data">
      <DateItem :value="data.price" :isNewIsinSelected="isNewIsinSelected" :className="'price'" />
      <label for="showBid_Ask">
        Show bid and Ask values?
        <input id="showBid_Ask" type="checkbox" v-model="showBid_Ask" />
      </label>
      <DateItem v-if="showBid_Ask" :value="data.bid" :className="'bid'" />
      <DateItem v-if="showBid_Ask" :value="data.ask" :className="'ask'" />
    </div>
    <p v-if="hasError.value">{{hasError.msg}}</p>
    <p v-if="disconnected">{{disconnected}}</p>
  </div>
</template>

<script>
import { webSocket } from "../socket";
import DateItem from "./components/DataItem";

export default {
  name: "App",
  components: {
    DateItem
  },
  data() {
    return {
      stocksList: [
        {
          name: "BASF",
          isin: "DE000BASF111"
        },
        {
          name: "Adidas",
          isin: "DE000A1EWWW0"
        },
        {
          name: "Private Assets AG",
          isin: "DE0006051139"
        },
        {
          name: "Apple",
          isin: "US0378331005"
        },
        {
          name: "Tesla",
          isin: "US88160R1014"
        },
        {
          name: "Microsoft",
          isin: "US5949181045"
        }
      ],
      subscribe: {
        name: "BASF",
        isin: "DE000BASF111"
      },
      data: {
        price: null,
        bid: null,
        ask: null
      },
      showBid_Ask: false,
      isNewIsinSelected: false,
      isUnsubscribed: false,
      hasError: {
        value: false,
        msg: null
      },
      disconnected: null
    };
  },
  methods: {
    handleChange() {
      webSocket.send(JSON.stringify({ subscribe: this.subscribe.isin }));
      this.isNewIsinSelected = false;
      this.isUnsubscribed = false;
    },
    unsubscribe() {
      webSocket.send(JSON.stringify({ unsubscribe: this.subscribe.isin }));
      this.isUnsubscribed = true;
    }
  },
  mounted() {
    webSocket.onopen = () => {
      webSocket.send(JSON.stringify({ subscribe: this.subscribe.isin }));
    };
    webSocket.onmessage = ({ data }) => {
      this.data = JSON.parse(data);
    };

    webSocket.onerror = err => {
      const error = new Error(err);
      this.hasError.msg = error.msg;
      this.hasError.value = true;
    };

    webSocket.onclose = () => {
      this.disconnected = "The socket has been closed.";
    };
  },
  watch: {
    subscribe(newSub, oldSub) {
      const { isin: oldIsin } = oldSub;
      const { isin: newIsin } = newSub;
      if (newIsin !== oldIsin) {
        webSocket.send(JSON.stringify({ unsubscribe: oldIsin }));
        this.isNewIsinSelected = true;
      }
    }
  }
};
</script>

<style lang="sass" scoped>
.app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  margin-top: 60px
  &-header
    max-width: 300px
    margin: 0 auto
    button, select
      display: block
      width: 100%
  &-hero
    margin: 50px 0 30px
    &-title
      margin-bottom: 20px
      h1
        margin-bottom: 0

.data
  display: flex
  flex-wrap: wrap
  max-width: 960px
  margin: 0 auto
</style>
