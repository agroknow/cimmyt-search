<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="shortcut icon" href="img/favicon.ico">
  <link rel="stylesheet" type="text/css" href="/cimmyt/css/angular-ui-switch.min.css">
  <link rel="stylesheet" type="text/css" href="/cimmyt/css/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="/cimmyt/css/main.css">
  <link href="https://fonts.googleapis.com/css?family=Roboto+Slab:300,400,700" rel="stylesheet">

</head>
<body>
  <div class="wrapper-fluid item-page">
    <div class="container">
      <?php
      $resource_id = basename(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
      $url = "http://166.78.156.63:8080/cimmyt/resource/".$resource_id."?format=json";
      $json = file_get_contents($url);
      $obj = json_decode($json);   
      $font_size = '3';
      print '<div class="row heading"><div class="col-md-2">'; 
      if (isset($obj->results[1]->detailed->aggregation->shownBy)) {

        $detailed_aggregation_shownBy = ($obj->results[1]->detailed->aggregation->shownBy);
        if (is_array($detailed_aggregation_shownBy)) {
          $elementCount6  = count($detailed_aggregation_shownBy);
          for ($i = 0; $i <= $elementCount6 -1 ; $i++) {

            $detailed_aggregation_shownBy_value = ($obj->results[1]->detailed->aggregation->shownBy[$i]->value);

            if (preg_match("/(.[a-z]{3,3}.jpg)/",$detailed_aggregation_shownBy_value)) {
              $url = "".$detailed_aggregation_shownBy_value."?sequence=3&amp;isAllowed=y";
              echo '<center><img alt="Thumbnail" src="'.$url.'"></center>' ;

            }

          }
        }
        else {
          $detailed_aggregation_shownBy_value = ($obj->results[1]->detailed->aggregation->shownBy->value);
        }




      }
      print '</div><div class="col-md-10">';
      if (isset($obj->results[0]->object->title->value)) {
        $title = ($obj->results[0]->object->title->value);
        echo '<h3>'.$title.'</h3>';

      }
      print '</div></div>';
      ?>
      
      <div class="row"   >
        <div class="col-md-2 buttons">

          <?php
          $detailed_aggregation_shownAt_value = ($obj->results[1]->detailed->aggregation->shownAt->value);

          echo "<a href=\"".$detailed_aggregation_shownAt_value."\" class=\"btn btn-large btn-default\"><i class=\"glyphicon glyphicon-new-window\"></i> View Source</a>";

          echo "<br/>";
          $detailed_aggregation_shownBy = ($obj->results[1]->detailed->aggregation->shownBy);

           if (is_array($detailed_aggregation_shownBy)) {
                    $elementCount6  = count($detailed_aggregation_shownBy);
                    for ($i = 0; $i <= $elementCount6 -1 ; $i++) {

                      $detailed_aggregation_shownBy_value = ($obj->results[1]->detailed->aggregation->shownBy[$i]->value);
                      if (strpos($detailed_aggregation_shownBy_value, 'pdf') == true && strpos($detailed_aggregation_shownBy_value, 'txt') == false && strpos($detailed_aggregation_shownBy_value, 'jpg') == false && strpos($detailed_aggregation_shownBy_value, 'jpeg') == false && strpos($detailed_aggregation_shownBy_value, 'png') == false) {

                        echo "<a href=\"".$detailed_aggregation_shownBy_value."\" class=\"btn btn-large btn-default\"><i class=\"glyphicon glyphicon-book\"></i> View Item</a>";  
                      }
          }
           }
           else {
           $detailed_aggregation_shownBy_value = ($obj->results[1]->detailed->aggregation->shownBy->value);
             echo "<a href=\"".$detailed_aggregation_shownBy_value."\" class=\"btn btn-large btn-default\"><i class=\"glyphicon glyphicon-book\"></i> View Item</a>";
           }

            echo "<a href=\"javascript:history.back()\" class=\"btn btn-large btn-success\"><i class=\"glyphicon glyphicon-arrow-left\"></i> Back to search</a>"; 

            ?>
          </div>
          <div class="col-md-5 first">
           <?php
           if (isset($obj->results[1]->detailed->date)) {
             if( strlen($obj->results[1]->detailed->date) > 0){
              $detailed_date = ($obj->results[1]->detailed->date);
              echo '<b>Publication Date</b><p><font size="'.$font_size.'">'.$detailed_date.'</font></p>';
            }
          }

          if (isset($obj->results[0]->object->subject)) {


            echo '<b>Subjects</b><div class="result-keywords">';

            $subject = ($obj->results[0]->object->subject);
            if (is_array($subject)) {
              $elementCount  = count($subject);
              for ($i = 0; $i <= $elementCount -1 ; $i++) {

                $value = ($obj->results[0]->object->subject[$i]->value);
                echo '<span><a class="label label-default" href="search/'.$value.'?type=publications,videos,photographs,datasets">'.$value.' </a></span>';

              }
            }
            else {
              print $subject->value;
            }
            
          }
          echo '</div>';
          if (isset($obj->results[0]->object->description->value)) {
           if (isset($obj->results[0]->object->description->lang)) { 
             if( strlen($obj->results[0]->object->description->value) > 0){
              if( strlen($obj->results[0]->object->description->lang) > 0){   
                $description_value = ($obj->results[0]->object->description->value);
                $description_language = ($obj->results[0]->object->description->lang);
                echo '<b>Description  ('.$description_language.')</b>
                <p><font size="'.$font_size.'">'.$description_value.'</font></p>';
              }
            }

          }
        }
        if (isset($obj->results[0]->object->language->value)) {

          $language_value = ($obj->results[0]->object->language->value);
//echo '<b>Language</b>
  //    <p><font size="'.$font_size.'">'.$language_value.'</font></p>';
          echo '<b>Language</b>
          <p><font size="'.$font_size.'">English</font></p>';   
        }
        if (isset($obj->results[0]->object->type)) {
          $type = ($obj->results[0]->object->type);
          echo '<b>Entity Type</b>
          <p><font size="'.$font_size.'">'.$type.'</font></p>';
        }
        
      

      
      $detailed_collection = ($obj->results[1]->detailed->collection);
      if (is_array($obj->results[1]->detailed->collection)) {
        echo '<b>Collections</b>';
          $elementCount2  = count($detailed_collection);
          for ($i = 0; $i <= $elementCount2 -1 ; $i++) {

           $detailed_collection_id = ($obj->results[1]->detailed->collection[$i]->id);
           $url = "http://52.18.30.225/cimmyt/collection/".$detailed_collection_id."?format=json";
           $json2 = file_get_contents($url);
           $obj2 = json_decode($json2);     
           $collection_name = ($obj2->results[0]->object->title->value);
           echo '<ul><li><font size="'.$font_size.'"> <a href="#'.$collection_name.'">'.$collection_name.' </a>  </font></li></ul>';
         }
      }
      else {
        if ($obj->results[1]->detailed->collection->value) {
          echo '<b>Collections</b>';
          print $obj->results[1]->detailed->collection->value;
        }
        
      }


     ?>
   </div>
   <div class="col-md-5">


    <?php

if (isset($obj->results[1]->detailed->creator)) {
          
          $detailed_creator = array_filter($detailed_creator);
          $detailed_creator = ($obj->results[1]->detailed->creator);
          $elementCount4  = count($detailed_creator);
          if ($elementCount4 > 1) {
            echo '<b>Creators</b>';
           for ($i = 0; $i <= $elementCount4 -1 ; $i++) {

            $detailed_creator_value = ($obj->results[1]->detailed->creator[$i]->value);

            echo '<ul><li><font size="'.$font_size.'"> <a href="#'.$detailed_creator_value.'">'.$detailed_creator_value.' </a>  </font></li></ul>';
          }
        }
        else {
          if ($obj->results[1]->detailed->creator->value != "") {
            echo '<b>Creators</b>';
          echo '<ul><li><font size="'.$font_size.'"> <a href="#'.$obj->results[1]->detailed->creator->value.'">'.$obj->results[1]->detailed->creator->value.' </a>  </font></li></ul>';
          }
          
        }
    
    if (isset($obj->results[1]->detailed->publisher->value)) {
      $detailed_publisher_value = ($obj->results[1]->detailed->publisher->value);

      echo '<b>Publisher</b>
      <p><font size="'.$font_size.'">'.$detailed_publisher_value.'</font></p>';   
    }    
    if (isset($obj->results[1]->detailed->citation)) {
     if( strlen($obj->results[1]->detailed->citation) > 0){
      $detailed_citation = ($obj->results[1]->detailed->citation);
      echo '<b>Citation</b>
      <p><font size="'.$font_size.'">'.$detailed_citation.'</font></p>';    
    }
  }    
  if (isset($obj->results[1]->detailed->doi)) {
   if( strlen($obj->results[1]->detailed->doi) > 0){
    $detailed_doi = ($obj->results[1]->detailed->doi);
    echo '<b>DOI</b>
    <p><font size="'.$font_size.'">'.$detailed_doi.'</font></p>';
  }
}
if (isset($obj->results[1]->detailed->issn)) {
 if( strlen($obj->results[1]->detailed->issn) > 0){
  $detailed_issn = ($obj->results[1]->detailed->issn);     
  echo '<b>ISSN</b>
  <p><font size="'.$font_size.'">'.$detailed_issn.'</font></p>';  
}
}

if (isset($obj->results[1]->detailed->page)) {
 if( strlen($obj->results[1]->detailed->page) > 0){

   $detailed_page = ($obj->results[1]->detailed->page);
   echo '<b>Page(s)</b>
   <p><font size="'.$font_size.'">'.$detailed_page.'</font></p>';     
 }

 if (isset($obj->results[1]->detailed->isbn)) {
   if( strlen($obj->results[1]->detailed->isbn) > 0){
    $detailed_isbn = ($obj->results[1]->detailed->isbn);
    echo '<b>ISBN</b>
    <p><font size="'.$font_size.'">'.$detailed_isbn.'</font></p>'; 
  }
}    
if (isset($obj->results[1]->detailed->location->value)) {
 if( strlen($obj->results[1]->detailed->location->value) > 0){
  $detailed_location_value = ($obj->results[1]->detailed->location->value);
  echo '<b>Location</b>
  <p><font size="'.$font_size.'">'.$detailed_location_value.'</font></p>'; 

}      
}

if (isset($obj->results[1]->detailed->place)) {
 if( strlen($obj->results[1]->detailed->place) > 0){
  $detailed_place = ($obj->results[1]->detailed->place);   
  echo '<b>Place</b>
  <p><font size="'.$font_size.'">'.$detailed_place.'</font></p>';
}
}    



if (isset($obj->results[1]->detailed->extent)) {
 if( strlen($obj->results[1]->detailed->extent) > 0){
   $detailed_extent = ($obj->results[1]->detailed->extent);
   echo '<b>Extent</b>
   <p><font size="'.$font_size.'">'.$detailed_extent.'</font></p>';    
 }      
}


}
if (isset($obj->results[1]->detailed->coverage)) {
 if( strlen($obj->results[1]->detailed->coverage) > 0){
   $detailed_coverage = ($obj->results[1]->detailed->coverage);
   echo '<b>Coverage</b>
   <p><font size="'.$font_size.'">'.$detailed_coverage.'</font></p>';    
 }      

}
if (isset($obj->results[1]->detailed->contributor->id)) {
 if( strlen($obj->results[1]->detailed->contributor->id) > 0){
   $detailed_contributor_id = ($obj->results[1]->detailed->contributor->id);
   echo '<b>Contributor</b>
   <p><font size="'.$font_size.'">'.$detailed_contributor_id.'</font></p>';   
 }      
}
if (isset($obj->results[1]->detailed->format)) {
 if( strlen($obj->results[1]->detailed->format) > 0){
   $detailed_format = ($obj->results[1]->detailed->format);
   echo '<b>Format</b>
   <p><font size="'.$font_size.'">'.$detailed_format.'</font></p>'; 
 }

} 


?>

</div>
</div>
<?php
$font_size = 3;




}  
if (isset($obj->results[1]->detailed->rights)) {
 if( strlen($obj->results[1]->detailed->rights) > 0){
  $detailed_rights = ($obj->results[1]->detailed->rights);
  echo '
  <p class="well"><b>Rights</b>'.$detailed_rights.'</p>';
}
}

?>
</div>
</div>   
</body>
</html>
