<?php
function classifyAttendances($concepts, $attendanceIn, $attendanceOut) {
    $start = new DateTime($attendanceIn);
    $end = new DateTime($attendanceOut);

    if ($end < $start) {
        $end->modify('+1 day');
    }

    $result = [];

    foreach ($concepts as $concept) {
        $conceptStart = new DateTime($concept['start']);
        $conceptEnd = new DateTime($concept['end']);

        if ($conceptEnd < $conceptStart) {
            $conceptEnd->modify('+1 day');
        }
                
        $rangeStart = max($start, $conceptStart);
        $rangeEnd = min($end, $conceptEnd);

        $duration = calculateRange($rangeStart,$rangeEnd);
        if ($duration > 0) {
            $result[$concept['id']] = isset($result[$concept['id']]) ? $result[$concept['id']] + $duration : $duration;
        }
    }

    $orderResult = orderResult($concepts, $result);
    

    return json_encode($orderResult);
}
function calculateRange($rangeStart,$rangeEnd){
    if ($rangeStart < $rangeEnd) {
        return ($rangeEnd->getTimestamp() - $rangeStart->getTimestamp()) / 3600;
    }
    return 0;
}
function orderResult($concepts, $result){
    $orderResult = [];
    foreach ($concepts as $concept) {
        if (isset($result[$concept['id']])) {
            $orderedResult[$concept['id']] = round($result[$concept['id']], 1);
        }
    }
    return $orderedResult;
}

// test console 1
$concepts = [
    ["id" => "HO", "name" => "HO", "start" => "08:00", "end" => "17:59"],
    ["id" => "HED", "name" => "HED", "start" => "18:00", "end" => "20:59"],
    ["id" => "HEN", "name" => "HEN", "start" => "21:00", "end" => "05:59"]
];

$attendanceIn = "08:00";
$attendanceOut = "11:30";
echo classifyAttendances($concepts, $attendanceIn, $attendanceOut);

// test console 2
$attendanceIn = "14:00";
$attendanceOut = "21:30";
echo classifyAttendances($concepts, $attendanceIn, $attendanceOut);

?>
