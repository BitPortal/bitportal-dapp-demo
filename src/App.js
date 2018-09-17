import React, { Component } from 'react';
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardTitle,
  Alert
} from 'reactstrap';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  bitportal = null;

  state = {
    bitportalLoaded: false,
    eosAccountLoaded: false,
    eosAccountName: null,
    publicKey: null,

    signAccount: '',
    signPublicKey: '',
    signError: null,
    signLoading: false,
    signResult: null,

    contract: 'eosio.token',
    symbol: 'EOS',
    precision: '4',
    fromAccount: '',
    toAccount: '',
    memo: '',
    transferError: null,
    transferLoading: false,
    transferResult: null,

    voter: '',
    producers: '',
    voteError: null,
    voteLoading: false,
    voteResult: null,

    netQuantity: '',
    cpuQuantity: '',
    stakeError: null,
    stakeLoading: false,
    stakeResult: null
  };

  onSignAccountChange = (event) => {
    this.setState({ signAccount: event.target.value, signError: null, signResult: null })
  }

  onSignPublicKeyChange = (event) => {
    this.setState({ signPublicKey: event.target.value, signError: null, signResult: null })
  }

  onSignDataChange = (event) => {
    this.setState({ signData: event.target.value, signError: null, signResult: null })
  }

  eosAuthSign = (event) => {
    event.preventDefault()

    if (
      this.state.bitportalLoaded &&
      this.state.signAccount &&
      this.state.signPublicKey &&
      this.state.signData &&
      !this.state.signLoading
    ) {
      this.setState({ signLoading: true })

      this.bitportal.eosAuthSign({
        account: this.state.signAccount,
        publicKey: this.state.signPublicKey,
        signData: this.state.signData
      }).then((data) => {
        this.setState({ signResult: JSON.stringify(data), signLoading: false })
      }).catch((error) => {
        this.setState({ signError: error.message, signLoading: false })
      })
    }
  }

  onSymbolChange = (event) => {
    this.setState({ symbol: event.target.value, transferError: null, transferResult: null })
  }

  onContractChange = (event) => {
    this.setState({ contract: event.target.value, transferError: null, transferResult: null })
  }

  onPrecisionChange = (event) => {
    this.setState({ precision: event.target.value, transferError: null, transferResult: null })
  }

  onFromAccountChange = (event) => {
    this.setState({ fromAccount: event.target.value, transferError: null, transferResult: null })
  }

  onToAccountChange = (event) => {
    this.setState({ toAccount: event.target.value, transferError: null, transferResult: null })
  }

  onAmountChange = (event) => {
    this.setState({ amount: event.target.value, transferError: null, transferResult: null })
  }

  onMemoChange = (event) => {
    this.setState({ memo: event.target.value, transferError: null, transferResult: null })
  }

  transferEOSAsset = (event) => {
    event.preventDefault()

    if (
      this.state.bitportalLoaded &&
      this.state.contract &&
      this.state.symbol &&
      this.state.precision &&
      this.state.fromAccount &&
      this.state.toAccount &&
      this.state.amount &&
      !this.state.transferLoading
    ) {
      this.setState({ transferLoading: true })

      this.bitportal.transferEOSAsset({
        amount: this.state.amount,
        symbol: this.state.symbol,
        contract: this.state.contract,
        from: this.state.fromAccount,
        to: this.state.toAccount,
        precision: this.state.precision,
        memo: this.state.memo
      }).then((data) => {
        this.setState({ transferResult: JSON.stringify(data), transferLoading: false })
      }).catch((error) => {
        this.setState({ transferError: error.message, transferLoading: false })
      })
    }
  }

  onVoterChange = (event) => {
    this.setState({ voter: event.target.value, voteError: null, voteResult: null })
  }

  onProducersChange = (event) => {
    this.setState({ producers: event.target.value, voteError: null, voteResult: null })
  }

  voteEOSProducers = (event) => {
    event.preventDefault()

    if (
      this.state.bitportalLoaded &&
      this.state.voter &&
      this.state.producers &&
      !this.state.voteLoading
    ) {
      this.setState({ voteLoading: true })

      this.bitportal.voteEOSProducers({
        voter: this.state.voter,
        producers: this.state.producers.replace(/\s/g, '').split(',').filter(v => v)
      }).then((data) => {
        this.setState({ voteResult: JSON.stringify(data), voteLoading: false })
      }).catch((error) => {
        this.setState({ voteError: error.message, voteLoading: false })
      })
    }
  }

  onCpuQuantityChange = (event) => {
    this.setState({ cpuQuantity: event.target.value, stakeError: null, stakeResult: null })
  }

  onNetQuantityChange = (event) => {
    this.setState({ netQuantity: event.target.value, stakeError: null, stakeResult: null })
  }

  pushEOSAction = (event) => {
    event.preventDefault()

    if (
      this.state.bitportalLoaded &&
      this.state.eosAccountName &&
      this.state.cpuQuantity &&
      this.state.netQuantity &&
      !this.state.stakeLoading
    ) {
      this.setState({ stakeLoading: true })

      this.bitportal.pushEOSAction({
        actions: [
          {
            account: 'eosio',
            name: 'delegatebw',
            authorization: [{
              actor: this.state.eosAccountName,
              permission: 'active'
            }],
            data: {
              from: this.state.eosAccountName,
              receiver: this.state.eosAccountName,
              stake_net_quantity: `${this.state.netQuantity} EOS`,
              stake_cpu_quantity: `${this.state.cpuQuantity} EOS`,
              transfer: 0
            }
          }
        ]
      }).then((data) => {
        this.setState({ stakeResult: JSON.stringify(data), stakeLoading: false })
      }).catch((error) => {
        this.setState({ stakeError: error.message, stakeLoading: false })
      })
    }
  }

  getCurrentWallet = () => {
    this.bitportal.getCurrentWallet().then(data => {
      this.setState({
        eosAccountName: data.account,
        fromAccount: data.account,
        signAccount: data.account,
        signPublicKey: data.publicKey,
        voter: data.account
      })
    }).catch(error => {
      this.setState({ errorMessage: error.message })
    })
  }

  componentDidMount() {
    document.addEventListener('bitportalapi', () => {
      this.bitportal = window.bitportal
      window.bitportal = null

      this.setState({ bitportalLoaded: true })
      this.getCurrentWallet()
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to BitPortal</h1>
        </header>
        {!this.state.bitportalLoaded &&
         <Container>
           <Row>
             <Col>
               <p className="App-intro">
                 Please open this page in BitPortal wallet, you can download it in <a href="https://www.bitportal.io/">https://www.bitportal.io</a>.
               </p>
             </Col>
           </Row>
         </Container>}
        {this.state.bitportalLoaded && <Container style={{ textAlign: 'left' }}>
          <Row>
            <Col>
              <div style={{ padding: '10px 0' }}>
                Your Account in BitPortal: {this.state.eosAccountName}
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card style={{ marginBottom: '20px' }}>
                <CardBody>
                  <CardTitle>Sign</CardTitle>
                  <Form onSubmit={this.eosAuthSign}>
                    <FormGroup>
                      <Label for="signAccount">Account:</Label>
                      <Input
                        type="text"
                        name="signAccount"
                        id="signAccount"
                        value={this.state.signAccount}
                        onChange={this.onSignAccountChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="signPublicKey">Public Key:</Label>
                      <Input
                        type="text"
                        name="signPublicKey"
                        id="signPublicKey"
                        value={this.state.signPublicKey}
                        onChange={this.onSignPublicKeyChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="signData">Sign Data:</Label>
                      <Input
                        type="text"
                        name="signData"
                        id="signData"
                        value={this.state.signData}
                        onChange={this.onSignDataChange}
                      />
                    </FormGroup>
                    <Button style={{ marginBottom: '10px', ...(this.state.signLoading ? { opacity: '0.7' } : {}) }}>{!this.state.signLoading ? 'Submit' : 'Submitting'}</Button>
                    {this.state.signError && <Alert color="danger">
                      {this.state.signError}
                    </Alert>}
                    {this.state.signResult && <Alert color="success">
                      {this.state.signResult}
                    </Alert>}
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card style={{ marginBottom: '20px' }}>
                <CardBody>
                  <CardTitle>Transfer</CardTitle>
                  <Form onSubmit={this.transferEOSAsset}>
                    <FormGroup>
                      <Label for="contract">Contract:</Label>
                      <Input
                        type="text"
                        name="contract"
                        id="contract"
                        value={this.state.contract}
                        onChange={this.onContractChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="symbol">Symbol:</Label>
                      <Input
                        type="text"
                        name="symbol"
                        id="symbol"
                        value={this.state.symbol}
                        onChange={this.onSymbolChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="precision">Precision:</Label>
                      <Input
                        type="text"
                        name="precision"
                        id="precision"
                        value={this.state.precision}
                        onChange={this.onPrecisionChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="fromAccount">From Account:</Label>
                      <Input
                        type="text"
                        name="fromAccount"
                        id="fromAccount"
                        value={this.state.fromAccount}
                        onChange={this.onFromAccountChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="toAccount">To Account:</Label>
                      <Input
                        type="text"
                        name="toAccount"
                        id="toAccount"
                        value={this.state.toAccount}
                        onChange={this.onToAccountChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="amount">Amount:</Label>
                      <Input
                        type="text"
                        name="amount"
                        id="amount"
                        value={this.state.amount}
                        onChange={this.onAmountChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="memo">Memo:</Label>
                      <Input
                        type="text"
                        name="memo"
                        id="memo"
                        value={this.state.memo}
                        onChange={this.onMemoChange}
                      />
                    </FormGroup>
                    <Button style={{ marginBottom: '10px', ...(this.state.transferLoading ? { opacity: '0.7' } : {}) }}>{!this.state.transferLoading ? 'Submit' : 'Submitting'}</Button>
                    {this.state.transferError && <Alert color="danger">
                      {this.state.transferError}
                    </Alert>}
                    {this.state.transferResult && <Alert color="success">
                      {this.state.transferResult}
                    </Alert>}
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card style={{ marginBottom: '20px' }}>
                <CardBody>
                  <CardTitle>Vote</CardTitle>
                  <Form onSubmit={this.voteEOSProducers}>
                    <FormGroup>
                      <Label for="voter">voter:</Label>
                      <Input
                        type="text"
                        name="voter"
                        id="voter"
                        value={this.state.voter}
                        onChange={this.onVoterChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="producers">producers:</Label>
                      <Input
                        type="textarea"
                        name="producers"
                        id="producers"
                        rows="4"
                        placeHolder="Enter producers' name split by ',' example: eosasia11111, eosecoeoseco, eoshuobipool, eoslaomaocom"
                        value={this.state.producers}
                        onChange={this.onProducersChange}
                      />
                    </FormGroup>
                    <Button style={{ marginBottom: '10px', ...(this.state.voteLoading ? { opacity: '0.7' } : {}) }}>{!this.state.voteLoading ? 'Submit' : 'Submitting'}</Button>
                    {this.state.voteError && <Alert color="danger">
                      {this.state.voteError}
                    </Alert>}
                    {this.state.voteResult && <Alert color="success">
                      {this.state.voteResult}
                    </Alert>}
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card style={{ marginBottom: '20px' }}>
                <CardBody>
                  <CardTitle>Stake</CardTitle>
                  <Form onSubmit={this.pushEOSAction}>
                    <FormGroup>
                      <Label for="netQuantity">net quantity (EOS):</Label>
                      <Input
                        type="text"
                        name="netQuantity"
                        id="netQuantity"
                        placeHolder="example: 0.0001"
                        value={this.state.netQuantity}
                        onChange={this.onNetQuantityChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="cpuQuantity">cpu quantity (EOS):</Label>
                      <Input
                        type="text"
                        name="cpuQuantity"
                        id="cpuQuantity"
                        placeHolder="example: 0.0001"
                        value={this.state.cpuQuantity}
                        onChange={this.onCpuQuantityChange}
                      />
                    </FormGroup>
                    <Button style={{ marginBottom: '10px', ...(this.state.voteLoading ? { opacity: '0.7' } : {}) }}>{!this.state.stakeLoading ? 'Submit' : 'Submitting'}</Button>
                    {this.state.stakeError && <Alert color="danger">
                      {this.state.stakeError}
                    </Alert>}
                    {this.state.stakeResult && <Alert color="success">
                      {this.state.stakeResult}
                    </Alert>}
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>}
      </div>
    );
  }
}

export default App;
