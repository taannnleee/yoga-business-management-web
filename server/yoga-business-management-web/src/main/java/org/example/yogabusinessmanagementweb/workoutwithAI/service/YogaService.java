package org.example.yogabusinessmanagementweb.workoutwithAI.service;

import com.opencsv.exceptions.CsvException;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.yoga.WorkoutHistoryDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.yoga.YogaDto;

import java.io.IOException;
import java.util.List;

public interface YogaService {
    YogaDto upsert(YogaDto yogaDto);

    void delete(Long id);

    YogaDto findById(Long id);

    List<YogaDto> findAll();

    List<WorkoutHistoryDto> getWorkoutHistoryFromEmail(String name);

    WorkoutHistoryDto upsertWorkoutHistory(WorkoutHistoryDto workoutHistoryDto, String email);
    void createData() throws IOException, CsvException;

}
