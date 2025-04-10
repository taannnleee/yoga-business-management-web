package org.example.yogabusinessmanagementweb.workoutwithAI.service.impl;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.UserWorkout;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.mapper.YogaHistoryMapper;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.mapper.YogaMapper;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.yoga.WorkoutHistoryDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.yoga.YogaDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.WorkoutHistory;
import org.example.yogabusinessmanagementweb.workoutwithAI.entity.YogaWorkout;
import org.example.yogabusinessmanagementweb.workoutwithAI.exception.BadRequestException;
import org.example.yogabusinessmanagementweb.workoutwithAI.repository.UserWorkoutRepository;
import org.example.yogabusinessmanagementweb.workoutwithAI.repository.WorkoutHistoryRepository;
import org.example.yogabusinessmanagementweb.workoutwithAI.repository.YogaWorkoutRepository;
import org.example.yogabusinessmanagementweb.workoutwithAI.service.YogaService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@AllArgsConstructor
public class YogaServiceImpl implements YogaService {
    private final YogaWorkoutRepository yogaRepository;
    private final WorkoutHistoryRepository historyRepository;
    private final UserWorkoutRepository userRepository;

    @Override
    public YogaDto upsert(YogaDto yogaDto) {
        Authentication authentication = SecurityContextHolder
                .getContext().getAuthentication();
        if (authentication == null) {
            throw BadRequestException.message("User not authenticated");
        }
        if (authentication.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw BadRequestException.message("User not authorized");
        }

        if (yogaDto == null) {
            throw BadRequestException.message("Yoga workout cannot be null");
        }
        if (yogaDto.getId() != null && yogaDto.getId() <= 0) {
            yogaDto.setId(null);
        }
        YogaWorkout yoga = YogaMapper.INSTANCE.toYoga(yogaDto);
        yoga = yogaRepository.save(yoga);
        return YogaMapper.INSTANCE.toYogaDto(yoga);
    }

    @Override
    public void delete(Long id) {
        if (!yogaRepository.existsById(id)) {
            throw BadRequestException.message("Yoga workout not found");
        }
        yogaRepository.deleteById(id);
    }

    @Override
    public YogaDto findById(Long id) {
        return yogaRepository.findById(id)
                .map(YogaMapper.INSTANCE::toYogaDto)
                .orElseThrow(() -> BadRequestException.message("Yoga workout not found"));
    }

    @Override
    public List<YogaDto> findAll() {
        return YogaMapper.INSTANCE.toYogaDtoList(yogaRepository.findAll());
    }

    @Override
    public List<WorkoutHistoryDto> getWorkoutHistoryFromEmail(String email) {
        List<WorkoutHistory> history
                = historyRepository.findByUserEmail(email);
        return YogaHistoryMapper.INSTANCE
                .toYogaHistoryDtoList(history);
    }

    @Override
    @Transactional
    public WorkoutHistoryDto upsertWorkoutHistory(WorkoutHistoryDto workoutHistoryDto, String email) {
        WorkoutHistory history = YogaHistoryMapper.INSTANCE.toYogaHistory(workoutHistoryDto);
        if (history == null) {
            throw BadRequestException.message("Workout history cannot be null");
        }
        if (history.getYogaWorkout() == null) {
            throw BadRequestException.message("Yoga workout cannot be null");
        }
        if (!yogaRepository.existsById(history.getYogaWorkout().getId())) {
            throw BadRequestException.message("Yoga workout not found");
        }
        if (history.getStartTime() == null) {
            history.setStartTime(LocalDateTime.now());
        }

        UserWorkout user = userRepository.findByEmail(email)
                .orElseThrow(() -> BadRequestException.message("User not found"));
        history.setUser(user);
        YogaWorkout workout = yogaRepository.findById(history.getYogaWorkout().getId())
                .orElseThrow(() -> BadRequestException.message("Yoga workout not found"));
        history.setYogaWorkout(workout);

        // insert
        if ( history.getId() == null || history.getId() <= 0) {
            history = historyRepository.save(history);
            return YogaHistoryMapper.INSTANCE.toYogaHistoryDto(history);
        }

        // update
        WorkoutHistory oldHistory = historyRepository.findById(history.getId())
                .orElseThrow(() -> BadRequestException.message("Workout history not found"));
        if (!Objects.equals(oldHistory.getUser().getId(), user.getId())) {
            throw BadRequestException.message("User not authorized");
        }
        if (!Objects.equals(oldHistory.getYogaWorkout().getId(),
                history.getYogaWorkout().getId())) {
            throw BadRequestException.message("Yoga workout cannot be changed");
        }

        oldHistory.setStartTime(history.getStartTime());
        oldHistory.setDone(history.isDone());
        oldHistory = historyRepository.save(oldHistory);
        return YogaHistoryMapper.INSTANCE.toYogaHistoryDto(oldHistory);
    }

    @Override
    public void createData() throws IOException, CsvException {
        if (yogaRepository.count() > 0) {
            return;
        }
        // read csv file in classpath csv/yoga-raw.csv and insert to database
        try (CSVReader reader = new CSVReader(
                new InputStreamReader(Objects.requireNonNull(
                        getClass().getClassLoader()
                                .getResourceAsStream("csv/yoga-raw.csv"))))) {
            List<String[]> r = reader.readAll();
            r.forEach(row -> {
                YogaWorkout yoga = YogaWorkout.builder()
                        .name(row[0])
                        .description(row[1])
                        .videoUrl(row[2])
                        .imageUrl(row[3])
                        .level(Integer.parseInt(row[4]))
                        .duration(Integer.parseInt(row[5]))
                        .point(Double.parseDouble(row[6]))
                        .instruction(row[7])
                        .build();
                yogaRepository.save(yoga);
            });
        }
    }

}
