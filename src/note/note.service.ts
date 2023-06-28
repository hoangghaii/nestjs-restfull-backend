import { ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { InsertNoteDto, UpdateNoteDto } from './dto';

@Injectable()
export class NoteService {
  constructor(private prismaService: PrismaService) {}

  async getNotes(userId: string) {
    try {
      const notes = await this.prismaService.note.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          description: true,
          url: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return notes;
    } catch (error) {
      throw new ForbiddenException('Error in input information');
    }
  }

  async getNoteById(noteId: string) {
    try {
      const note = await this.prismaService.note.findUnique({
        where: { id: noteId },
        select: {
          id: true,
          title: true,
          description: true,
          url: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!note) {
        throw new ForbiddenException('Error in input information');
      }

      return note;
    } catch (error) {
      throw new ForbiddenException('Error in input information');
    }
  }

  async insertNote(userId: string, inserNoteDto: InsertNoteDto) {
    try {
      const note = await this.prismaService.note.create({
        data: {
          ...inserNoteDto,
          userId,
        },
      });

      delete note.userId;

      return note;
    } catch (error) {
      throw new ForbiddenException('Error in input information');
    }
  }

  async updateNote(noteId: string, updateNoteDto: UpdateNoteDto) {
    try {
      const note = await this.prismaService.note.findUnique({
        where: { id: noteId },
      });

      if (!note) {
        throw new ForbiddenException('Error in input information');
      }

      const updatedNote = await this.prismaService.note.update({
        where: { id: noteId },
        data: { ...updateNoteDto },
        select: {
          id: true,
          title: true,
          description: true,
          url: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedNote;
    } catch (error) {
      throw new ForbiddenException('Error in input information');
    }
  }

  async deleteNote(noteId: string) {
    try {
      const note = await this.prismaService.note.findUnique({
        where: { id: noteId },
      });

      if (!note) {
        throw new ForbiddenException('Error in input information');
      }

      await this.prismaService.note.delete({
        where: { id: noteId },
      });
    } catch (error) {
      throw new ForbiddenException('Error in input information');
    }
  }
}
