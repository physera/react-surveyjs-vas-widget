# react-surveyjs-vas-widget
Custom widget for SurveyJS to render visual analog score questions in surveys


# Visual Analog Scale React custom question widget for SurveyJS 

This react component allows to render a [SurveyJS](https://github.com/surveyjs/surveyjs) rating question as a [visual analog scale](https://www.physio-pedia.com/Visual_Analogue_Scale) using the SurveyJS [custom widgets](https://surveyjs.io/Examples/Editor/?id=customwidgets) API.

This component makes use of the Slider widget from [react-toolbox](http://react-toolbox.com/#/components/slider).

![Screen capture for VAS widget](http://g.recordit.co/F4EFiXrT71.gif)

## Installation

To install this Component, run `yarn add https://github.com/physera/react-surveyjs-vas-widget` or `npm install https://github.com/physera/react-surveyjs-vas-widget`.

Install [SurveyJS for React](https://www.npmjs.com/package/survey-react) with `yarn add survey-react` or `npm install survey-react`

See also [Custom CSS](https://surveyjs.io/Examples/Library/?id=survey-customcss&platform=Reactjs) for SurveyJS


## Usage

To use the component, In your react Application just do

```json

```

```javascript
import { Survey, CustomWidgetCollection } from 'survey-react';
import VASSlider from 'react-surveyjs-vas-widget';

class MySurvey extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        complete: false,
        saving: false,
      };
      Survey.cssType = 'bootstrap';
      const vas_questions_names = ['NPRS'];
      CustomWidgetCollection.Instance.addCustomWidget({
        name: 'visual_analog_scale',
        isFit: question => _.includes(vas_questions_names, question.name),
        render: question => (
          <VASSlider
            minRateDescription={question.minRateDescription}
            maxRateDescription={question.maxRateDescription}
            onRatingChange={(rating) => { question.value = rating; }}
          />),
      });
    }

    submitSurvey = (result) => {
      console.log('Survey result data', result.data)
    }

    const customCss = {
      header: {
        display: "block"
      },
      progressBar: {
        background-color: red;
      },
    };

    const surveyJson = {
       pages: [
        {
         name: "page1",
         elements: [
           {
             "type":"rating",
             "renderAs":"visual_analog_scale",
             "name":"NPRS",
             "title":"With respect to your condition, please rate your pain by clicking or tapping on the line below.",
             "minRateDescription":"No pain",
             "maxRateDescription":"Worst pain imaginable",
             "isRequired": true
           }
         ]
        }
       ]
     };

    return (
      <Survey
        json={surveyJson}
        css={customCss}
        onComplete={this.submitSurvey}
      />
    )

}

export default MySurvey;


```
