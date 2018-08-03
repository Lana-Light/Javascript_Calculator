const ids = [
  "clear",
  "clear-one",
  "multiply",
  "divide",
  "seven",
  "eight",
  "nine",
  "add",
  "four",
  "five",
  "six",
  "subtract",
  "one",
  "two",
  "three",
  "equals",
  "zero",
  "decimal"
];
const text = [
  "CE",
  "AC",
  "*",
  "/",
  7,
  8,
  9,
  "+",
  4,
  5,
  6,
  "-",
  1,
  2,
  3,
  "=",
  0,
  ".",
  "%"
];
const mnoz = /[\*\/\%]/g;
const plus = /[\+\-]/g;
const Input = props => {
  return <input type="text" value={props.value} onChange={props.handleInput} />;
};
const Output = props => {
  return <p id="display">{props.character}</p>;
};
const Button = props => {
  return (
    <button id={props.id} onClick={props.handleChange}>
      {props.text}
    </button>
  );
};
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      character: 0,
      answer: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.remove = this.remove.bind(this);
    this.display = this.display.bind(this);
  }
  remove(char, value) {
    if (char.match(/[0-9\.]/g) && char.length > 1) {
      char = char.slice(0, -1);
    } else if (char.match(/[\+\-\*\/\%]/g) && value.length > 0) {
      let mathMatch = value.match(/([0-9\.])*$/g);
      char = mathMatch[0];
    } else if (value.length == 0) {
      char = "0";
    } else {
      char = value[value.length - 1];
    }
    this.setState({
      value: value,
      character: char
    });
  }
  display(val) {
    let answer = this.state.value.toString();
    let char = this.state.character.toString();
    if (val.match(/[0-9\+\-\*\/\%\.]/g)) {
      if (char.match(/[\+\-\*\/\%]/g)) {
        if (val.match(/[\+\-\*\/\%]/g)) {
          char = val;
          answer = answer.slice(0, -1) + val;
        } else {
          char = val;
          answer += val;
        }
      } else if (char == "0") {
        if (val.match(/[\+\-\*\/\%]/g)) {
          char = val;
          answer += val;
        } else if (val.match(/[1-9]/g)) {
          char = val;
          answer = answer.slice(0, -1) + val;
        } else if (val == "0") {
          if (answer == "") {
            char = val;
            answer += val;
          }
        } else if (val == ".") {
          char += val;
          answer += val;
        }
      } else if (char.match(/[0-9]/g) && !char.match(/\./g)) {
        if (val.match(/[0-9\.]/g)) {
          char += val;
          answer += val;
        } else {
          char = val;
          answer += val;
        }
      } else if (char.match(/\./g)) {
        if (val.match(/[0-9]/g)) {
          char += val;
          answer += val;
        } else if (val.match(/[\+\-\*\/\%]/g)) {
          char = val;
          answer += val;
        }
      }
      this.setState({
        value: answer,
        character: char
      });
      let plusmin = answer.match(plus);
      let sum = [];
      let multidivide = [];
      let dels = answer.split(plus);
      let items = [];
      let num = 0;
      for (let i = 0; i < dels.length; i++) {
        if (dels[i].match(mnoz)) {
          multidivide = dels[i].match(mnoz);
          dels[i] = dels[i].split(mnoz);
          for (var j = 0; j < dels[i].length; j++) {
            items.push(Number(dels[i][j]));
          }
          num = items[0];
          for (var k = 1; k < items.length; k++) {
            switch (multidivide[k - 1]) {
              case "*":
                num *= items[k];
                break;
              case "/":
                num /= items[k];
                break;
              case "%":
                num %= items[k];
                break;
            }
          }
          sum.push(num);
          items = [];
        } else {
          sum.push(Number(dels[i]));
        }
      }
      num = sum[0];
      for (let i = 1; i < sum.length; i++) {
        switch (plusmin[i - 1]) {
          case "+":
            num += sum[i];
            break;
          case "-":
            num -= sum[i];
            break;
        }
      }
      answer = num;
      this.setState({
        answer: answer
      });
    }
    if (val.match(/\=/g)) {
      this.setState({
        value: this.state.answer,
        character: this.state.answer
      });
    }
    if (val.match("CE")) {
      this.setState({
        value: "",
        answer: "",
        character: 0
      });
    }
    if (val.match("AC")) {
      if (answer.length > 1) {
        answer = answer.slice(0, answer.length - 1);
      } else {
        answer = "";
      }
      this.remove(char, answer);
    }
  }
  handleChange(e) {
    const val = e.target.innerHTML;
    this.display(val);
  }
  handleInput(e) {
    const val = e.target.value;
    const lastVal = val[val.length - 1];
    if (this.state.value.toString().length > val.length) {
      let char = this.state.character;
      this.remove(char, val);
    } else {
      this.display(lastVal);
    }
  }
  render() {
    let buttons = [];
    for (var i = 0; i < ids.length + 1; i++) {
      if (i < ids.length) {
        buttons.push(
          <Button
            id={ids[i]}
            text={text[i]}
            handleChange={this.handleChange}
            key={i}
          />
        );
      } else {
        buttons.push(
          <Button
            id=""
            text={text[i]}
            handleChange={this.handleChange}
            key={i}
          />
        );
      }
    }
    return (
      <main>
        <h1>JavaScript Calculator</h1>
        <Input value={this.state.value} handleInput={this.handleInput} />
        <Output character={this.state.character} />
        <div className="buttons">{buttons}</div>
      </main>
    );
  }
}
ReactDOM.render(<App />, document.getElementById("root"));
