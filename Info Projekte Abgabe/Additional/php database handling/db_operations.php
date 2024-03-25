<?php
function saveFieldStatsToDatabase($fieldName, $field, $frameNumber,$numXCells, $pdo) {
    // Calculate statistics
    $max = max($field);
    $min = min($field);
    $sum = array_sum($field);
    $avg = $sum / count($field);

    // Find the index of the cell with the maximum value
    $maxIndex = array_search($max, $field);
    $maxRowIndex = floor($maxIndex / $numXCells); // Assuming $numXCells is defined elsewhere
    $maxColIndex = $maxIndex % $numXCells;

    // Find the index of the cell with the minimum value
    $minIndex = array_search($min, $field);
    $minRowIndex = floor($minIndex / $numXCells); // Assuming $numXCells is defined elsewhere
    $minColIndex = $minIndex % $numXCells;

    // Prepare SQL statement
    $sql = "INSERT INTO field_stats (field_name, max_value, min_value, avg_value, max_row_index, max_col_index, min_row_index, min_col_index, frame_number) VALUES (:fieldName, :max, :min, :avg, :maxRowIndex, :maxColIndex, :minRowIndex, :minColIndex, :frameNumber)";
    $stmt = $pdo->prepare($sql);

    // Bind parameters and execute statement
    $stmt->bindParam(':fieldName', $fieldName);
    $stmt->bindParam(':max', $max);
    $stmt->bindParam(':min', $min);
    $stmt->bindParam(':avg', $avg);
    $stmt->bindParam(':maxRowIndex', $maxRowIndex);
    $stmt->bindParam(':maxColIndex', $maxColIndex);
    $stmt->bindParam(':minRowIndex', $minRowIndex);
    $stmt->bindParam(':minColIndex', $minColIndex);
    $stmt->bindParam(':frameNumber', $frameNumber);

    try {
        $stmt->execute();
        echo "Statistics saved to database successfully!";
    } catch (PDOException $e) {
        echo "Error saving statistics to database: " . $e->getMessage();
    }
}

