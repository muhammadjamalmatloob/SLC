import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Search, 
  Building2, 
  Users, 
  Edit2, 
  Trash2, 
  DoorOpen,
  Calendar
} from 'lucide-react';

export default function ClassroomsView({ onOpenAddModal, onEditClassroom }) {
  const { classrooms, timetableSlots, deleteClassroom } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClassrooms = classrooms.filter(rm => {
    return (
      rm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rm.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rm.building && rm.building.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-6xl mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-800">Classrooms & Facilities</h2>
          <p className="text-xs text-muted">Manage physical lecture rooms, laboratories & seating capacities</p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="gradient-coral text-white font-bold text-xs px-5 py-3 rounded-full shadow-glow flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Classroom</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl shadow-soft border border-gray-100">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by room name, type, or building..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl bg-canvas border border-gray-200 focus:outline-none focus:border-coral-500"
          />
        </div>
      </div>

      {/* Classrooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClassrooms.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-soft">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-navy-800">No classrooms found</h4>
            <p className="text-xs text-muted mt-1">Add a new room or adjust search query.</p>
          </div>
        ) : (
          filteredClassrooms.map((room) => {
            const scheduledSlots = timetableSlots.filter(s => s.room.trim().toLowerCase() === room.name.trim().toLowerCase());

            return (
              <div
                key={room.id}
                className="bg-white p-5 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-between hover:border-coral-200 transition-all shadow-card-hover"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-extrabold text-xs text-coral-600 bg-coral-50 border border-coral-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      <DoorOpen className="w-3.5 h-3.5" />
                      {room.name}
                    </span>

                    <span className="text-[10px] font-bold text-navy-800 bg-canvas px-2.5 py-1 rounded-full border border-gray-200">
                      {room.type}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-navy-800 mt-2 mb-1">
                    {room.name}
                  </h3>
                  <p className="text-xs text-muted mb-3">
                    {room.floor} • {room.building || 'Main Campus'}
                  </p>

                  <div className="space-y-2 py-2 border-y border-gray-100 text-xs">
                    <div className="flex items-center justify-between text-navy-700">
                      <span className="text-muted flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        Max Capacity:
                      </span>
                      <span className="font-bold">{room.capacity} Seats</span>
                    </div>

                    <div className="flex items-center justify-between text-navy-700">
                      <span className="text-muted flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-coral-500" />
                        Scheduled Lectures:
                      </span>
                      <span className="font-bold">{scheduledSlots.length} Slots / Wk</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 pt-3 mt-2 border-t border-gray-50">
                  <button
                    onClick={() => onEditClassroom(room)}
                    className="p-2 text-navy-600 hover:text-coral-600 hover:bg-coral-50 rounded-xl transition-colors"
                    title="Edit Classroom"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete classroom "${room.name}"?`)) {
                        deleteClassroom(room.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-coral-600 hover:bg-coral-50 rounded-xl transition-colors"
                    title="Delete Classroom"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
