import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { GetUser } from '../auth/decorators';
import { MyJwtGuard } from '../auth/guard';
import { InsertNoteDto, UpdateNoteDto } from './dto';
import { NoteService } from './note.service';

@UseGuards(MyJwtGuard)
@Controller('note')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Get()
  getNotes(@GetUser('id') userId: string) {
    return this.noteService.getNotes(userId);
  }

  @Get(':id')
  getNoteById(@Param('id') noteId: string) {
    return this.noteService.getNoteById(noteId);
  }

  @Post()
  insertNote(
    @GetUser('id') userId: string,
    @Body() inserNoteDto: InsertNoteDto,
  ) {
    return this.noteService.insertNote(userId, inserNoteDto);
  }

  @Patch(':id')
  updateNote(
    @Param('id') noteId: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.noteService.updateNote(noteId, updateNoteDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  deleteNote(@Query('id') noteId: string) {
    return this.noteService.deleteNote(noteId);
  }
}
