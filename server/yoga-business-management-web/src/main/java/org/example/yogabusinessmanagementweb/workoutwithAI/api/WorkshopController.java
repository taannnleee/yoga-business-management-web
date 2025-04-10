package org.example.yogabusinessmanagementweb.workoutwithAI.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.ResponseDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.request.workshop.WorkshopRequestDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.response.workshop.JoinWorkshopResponseDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.dto.response.workshop.WorkshopResponseDto;
import org.example.yogabusinessmanagementweb.workoutwithAI.service.WorkshopService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/workshops")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(originPatterns = "*")
public class WorkshopController {
    private final WorkshopService workshopService;

    //-----WORKSHOP API-----//
    //Get all workshop
    @GetMapping
    public ResponseEntity<ResponseDto<List<WorkshopResponseDto>>> getAllWorkshop(){
        return ResponseEntity.ok().body(workshopService.getAllWorkshop());
    }
    //Get workshop by id
    @GetMapping("/{id}")
    public ResponseEntity<ResponseDto<WorkshopResponseDto>> getWorkshopById(@PathVariable Long id){
        return ResponseEntity.ok().body(workshopService.getWorkshopById(id));
    }
    //Create workshop
    @PostMapping("/create")
    public ResponseEntity<ResponseDto<WorkshopResponseDto>> createNewWorkshop(@Valid @RequestBody WorkshopRequestDto workshopRequestDto, Authentication authentication){
        return ResponseEntity.ok().body(workshopService.createNewWorkshop(workshopRequestDto, authentication.getName()));
    }
    //Edit workshop
    @PutMapping("/{id}/edit")
    public ResponseEntity<ResponseDto<WorkshopResponseDto>> editWorkshop(@PathVariable Long id, @Valid @RequestBody WorkshopRequestDto workshopRequestDto, Authentication authentication){
        return ResponseEntity.ok().body(workshopService.editWorkshop(id, workshopRequestDto, authentication.getName()));
    }
    //Delete workshop
    @DeleteMapping("/{id}/delete")
    public ResponseEntity<ResponseDto<String>> deleteWorkshop(@PathVariable Long id, Authentication authentication){
        return ResponseEntity.ok().body(workshopService.deleteWorkshop(id, authentication.getName()));
    }
    //Join workshop
    @PostMapping("/{id}/join")
    public ResponseEntity<ResponseDto<JoinWorkshopResponseDto>> joinWorkshop(@PathVariable Long id, Authentication authentication){
        return ResponseEntity.ok().body(workshopService.joinWorkshop(id, authentication.getName()));
    }
    //Out workshop
    @PostMapping("/{id}/out")
    public ResponseEntity<ResponseDto<JoinWorkshopResponseDto>> outWorkshop(@PathVariable Long id, Authentication authentication){
        return ResponseEntity.ok().body(workshopService.outWorkshop(id, authentication.getName()));
    }
    //Check is join
    @GetMapping("/{id}/isJoined")
    public ResponseEntity<ResponseDto<Boolean>> checkIsJoinedWorkshop(@PathVariable Long id, Authentication authentication){
        return ResponseEntity.ok().body(workshopService.checkIsJoinedWorkshop(id, authentication.getName()));
    }
    //Cancel workshop
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ResponseDto<WorkshopResponseDto>> cancelWorkshop(@PathVariable Long id, Authentication authentication){
        return ResponseEntity.ok().body(workshopService.cancelWorkshop(id, authentication.getName()));
    }
}
