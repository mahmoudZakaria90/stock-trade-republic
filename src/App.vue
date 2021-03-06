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
      <p
        v-if="isUnsubscribed && !isNewIsinSelected"
        class="data-unsubscribed"
      >You are not subscribed to: {{subscribe.name}}</p>
      <p v-else>You are {{receiveStatement}} a continuous updates for {{updateStatement}}</p>
      <div class="app-hero-title">
        <h1>
          {{subscribe.name}}
          <span
            title="remove from the list."
            class="data-remove"
            @click="removeFromList"
          >&times;</span>
        </h1>
        <small>{{subscribe.isin}}</small>
      </div>
      <button :disabled="isNewIsinSelected || isUnsubscribed" @click="unsubscribe">Unsubscribe</button>
    </div>

    <div class="data">
      <DateItem :value="data.price" :className="'price'" />
      <label for="showBid_Ask">
        Show bid and Ask values?
        <input id="showBid_Ask" type="checkbox" v-model="showBid_Ask" />
      </label>
      <DateItem v-show="showBid_Ask" :value="data.bid" :className="'bid'" />
      <DateItem v-show="showBid_Ask" :value="data.ask" :className="'ask'" />
    </div>
    <p v-if="hasError.value">{{hasError.msg}}</p>
    <p v-if="disconnected">{{disconnected}}</p>
  </div>
</template>

<script>
import { webSocket } from "../socket";
import stocksList from "../socket/stocksList";
import DateItem from "./components/DataItem";

export default {
  name: "App",
  components: {
    DateItem
  },
  data() {
    return {
      stocksList,
      subscribe: stocksList[0],
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
    },
    removeFromList() {
      if (this.stocksList.length === 1) {
        return;
      }
      this.stocksList = this.stocksList.filter(
        ({ name }) => name !== this.subscribe.name
      );
      this.subscribe = this.stocksList[0];
    }
  },
  computed: {
    receiveStatement() {
      return this.isNewIsinSelected ? "about to receive" : "receiving";
    },
    updateStatement() {
      return this.isNewIsinSelected
        ? `${this.subscribe.name}, please hit 'Subscribe' to update.`
        : ":";
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
        position: relative
        margin-bottom: 0

.data
  display: flex
  flex-wrap: wrap
  max-width: 960px
  margin: 0 auto
  &-unsubscribed
    margin-top: 50px
    color: red
  &-remove
    font-size: 20px
    vertical-align: middle
    cursor: pointer
    color: red
</style>
