//  main.js
//  Contains logic for MCQ APP
//  Author: B P Likith Sai

const XMLFILENAME = 'data.xml';                                         
const KEY = "quiz";
const MCQAnswers = [];
var MCQDATA = JSON.parse(window.localStorage.getItem(KEY)) || [];
var AnsweredQuestion = 0;
var result = 0;

$(function () {
   loadItem(XMLFILENAME);
   // check if XML objects are loaded or not
   if (localStorage.getItem(KEY) !== null) {
      updateDOMElements('#root', MCQDATA);
   } else {   
      location.reload();
   }
});

// function to load item from XML File
function loadItem(file) {
   $.ajax({
      type: "GET",
      url: file,
      cache: false,
      dataType: "xml",
      success: function (xml) {
         mcqArray = [];
         $(xml).find('Questions').each(function () {
            var options = [];

            $(this).find('Options').children().each(function () {
               options.push($(this).text());
            });

            mcqArray.push({
               id: $(this).find('Id').text(),
               description: $(this).find('Description').html(),
               subtitle: $(this).find('Subtitle').html(),
               options: options,
               answer: $(this).find('Answer').text()
            })
         });

         window.localStorage.setItem(KEY, JSON.stringify(mcqArray));
      },
      error: function (data, errorThrown) {
         console.log('request failed : ' + errorThrown);
      }
   });
}


// Function to update the data from xml file and show it in UI
function updateDOMElements(id, items) {
   $(id).html(`
      <div class="container-fluid main">
         <div class="row mx-1 main-questions">
            <div class="question-count col-lg-1 text-center text-white offset-lg-0 rounded-bottom px-1 pt-3 pb-4 h-100 bg-green d-flex justify-content-between d-lg-block px-2">
               <div><span class="fw-bold">Question</span></div>
               <div><span id="questions" class="fw-bold">${AnsweredQuestion}/${MCQDATA.length}</span></div>
            </div>
            <div class="col-lg-11 px-0 px-lg-1 rounded">
               <div class="quiz">
                  <div class="card text-center border-0">
                     <div class="card-header border-0 bg-lightgreen">MCQ Questionair</div>
                     <div class="card-body border-0">
                        <i class="card-title color-blue">Answer a simple question. <br />For each question, select the options and click on the submit button to lock down the option.</i>
                        <div class="text-center mt-3">
                           <button href="#" data-next="q1" class="quiz-start btn btn-success border-0">Start MCQ Questionair</button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   `);

   // loop through all the question in the XML file and display it in UI
   $.each(items, function (i) {
      $('.quiz').append(`
         <div id="q${i+1}" class="quiz-q card d-none border-0">
            <div class="card-header border-0 bg-lightgreen rounded">${$(this)[0].description}</div>
            <div class="card-body border-0">
               <i class="card-title color-blue">${$(this)[0].subtitle}</i>
               <div class="row my-5 mx-5 mx-lg-0 d-flex justify-content-center d-lg-flex justify-content-lg-between px-2">
                  <div class="col-12 col-xs-6 col-sm-6 col-md-4 col-lg-2 px-3 mb-3 p-3 bg-lightgreen border-right-10">
                     <img class="img-options img-responsive w-100 rounded" src="${$(this)[0].options[0]}" />
                     <input data-item="1" class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                  </div>
                  <div class="col-12 col-xs-6 col-sm-6 col-md-4 col-lg-2 px-3 mb-3 p-3 bg-lightgreen border-right-10">
                     <img class="img-options img-responsive w-100 rounded" src="${$(this)[0].options[1]}" />
                     <input data-item="2" class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                  </div>

                  <div class="col-12 col-xs-6 col-sm-6 col-md-4 col-lg-2 px-3 mb-3 p-3 bg-lightgreen border-right-10">
                     <img class="img-options img-responsive w-100 rounded" src="${$(this)[0].options[2]}" />
                     <input data-item="3" class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                  </div>
                  <div class="col-12 col-xs-6 col-sm-6 col-md-4 col-lg-2 px-3 mb-3 p-3 bg-lightgreen">
                     <img class="img-options img-responsive w-100 rounded" src="${$(this)[0].options[3]}" />
                     <input data-item="4" class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                  </div>
               </div>
               <div class="text-center mt-3">
                  <button data-next="${(i+1 != items.length) ? 'q' + (i+2) : 'result' }" class="${(i+1 != items.length) ? 'quiz-submit' : 'result' } btn btn-success rounded full-width-mobile border-0" disabled>Submit</button>
               </div>
            </div>
         </div>
      `);
   });

   $('.quiz').append(`
      <div id="result" class="card text-center d-none border-0">
         <div class="card-header border-0 bg-lightgreen rounded">Result</div>
         <div class="card-body border-0">
            <i class="card-title color-blue" id="results_show">The result is ${result}</i>
         </div>
      </div>
   `);

   $('.img-options').on('click', function () {
      const parentId = '#' + $(this).parent().parent().parent().parent().attr('id');
      $('input[type="radio"]').removeAttr('checked');
      $(this).next().attr('checked', 'true');
      $(parentId + ' .quiz-submit').attr('disabled', false);
      $(parentId + ' .result').attr('disabled', false);
   });

   $('.form-check-input').on('click', function() {
      const parentId = '#' + $(this).parent().parent().parent().parent().attr('id');
      $('input[type="radio"]').removeAttr('checked');
      $(this).attr('checked', 'true');
      $(parentId + ' .quiz-submit').attr('disabled', false);
      $(parentId + ' .result').attr('disabled', false);
   });

   $('.quiz-start').on('click', function () {
      var target = $(this).attr('data-next');
      $(this).parent().parent().parent().addClass('d-none');
      $('#' + target).removeClass('d-none');
      AnsweredQuestion = AnsweredQuestion + 1;
      $('#questions').text(AnsweredQuestion + '/' +  items.length)
   });


   // show the results
   $('.result').on('click', function() {
      var target = $(this).attr('data-next');
      MCQAnswers.push($("input[type='radio']:checked").attr('data-item'));
      $(this).parent().parent().parent().addClass('d-none');
      $('#' + target).removeClass('d-none');

      $.each(items, function (i) {
         if($(this)[0].answer === MCQAnswers[i]) {
            result = result + 1;
         }
      });
      $('#results_show').text('The result is ' + result);
   });

   $('.quiz-submit').on('click', function () {
      var target = $(this).attr('data-next');
      MCQAnswers.push($("input[type='radio']:checked").attr('data-item'));
      $(this).parent().parent().parent().addClass('d-none');
      $('#' + target).removeClass('d-none');
      AnsweredQuestion = AnsweredQuestion + 1;
      $('#questions').text(AnsweredQuestion + '/' +  items.length)
   });
}