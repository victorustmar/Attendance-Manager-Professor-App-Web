// Make sure to install styled-components: npm install styled-components
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { API_BASE } from '../api';

// ************ Styled Components ************
const SectionWrapper = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: flex-end;
`;

const ExportButton = styled.button`
  padding: 0.5rem 1rem;
  background: transparent;
  color: #1e1e5c;
  border: 2px solid #5f3dc4;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background: rgba(95, 61, 196, 0.1);
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background: #f4f4f4;
  color: #333333;
  padding: 0.75rem;
  text-align: center;
  border-bottom: 2px solid #e0e0e0;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background: #fafafa;
  }
`;

const Td = styled.td`
  padding: 0.5rem;
  text-align: center;
  border-top: 1px solid #eaeaea;
`;

const SuccessTd = styled(Td)`
  background: #d4edda;
  color: #155724;
`;

const DangerTd = styled(Td)`
  background: #f8d7da;
  color: #721c24;
`;

const ErrorText = styled.p`
  background: #ffd2d2;
  color: #d8000c;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

// ************ Component ************
const CourseAttendance = ({ courseId, courseName, courseType, series, group, token }) => {
  const [dates, setDates] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/attendance/course/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setDates(res.data.dates);
      setStudents(res.data.students);
    })
    .catch(() => setError('Failed to load attendance'));
  }, [courseId, token]);

  const handleExport = () => {
    const suffix = courseType === "Lecture" ? series : group;
    const metaRows = [
      ["Course Name", courseName],
      ["Course Type – Series/Group", `${courseType} – ${suffix}`],
      []  // blank line before the table
    ];
    const header = ['Student', ...dates, 'Total Present', '% Present'];
    const rows = students.map(s => {
      const presentCount = s.attendance.filter(v => v === 'present').length;
      const pct = dates.length ? Math.round(100 * presentCount / dates.length) + '%' : '0%';
      return [
        s.full_name,
        ...s.attendance.map(v => v === 'present' ? '✓' : '-'),
        presentCount,
        pct
      ];
    });
    const allRows = [...metaRows, header, ...rows];
    const csv = allRows.map(r => r.map(cell => `"${cell}"`).join(",")).join("\r\n");
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `course_${courseId}_attendance.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (error) return <ErrorText>{error}</ErrorText>;
  if (!dates.length) return <p>Loading…</p>;

  return (
    <>
      <SectionWrapper>
        <ExportButton onClick={handleExport}>📥 Export CSV</ExportButton>
      </SectionWrapper>
      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <Th>Student</Th>
              {dates.map(d => <Th key={d}>{d}</Th>)}
              <Th>Total Present</Th>
              <Th>% Present</Th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => {
              const total = s.attendance.filter(v => v === 'present').length;
              const pct   = dates.length ? Math.round(100 * total / dates.length) : 0;
              return (
                <Tr key={s.student_id}>
                  <Td>{s.full_name}</Td>
                  {s.attendance.map((v,i) =>
                    v === 'present' ? (
                      <SuccessTd key={i}>✓</SuccessTd>
                    ) : (
                      <DangerTd key={i}>—</DangerTd>
                    )
                  )}
                  <Td>{total}</Td>
                  <Td>{pct}%</Td>
                </Tr>
              );
            })}
          </tbody>
        </StyledTable>
      </TableWrapper>
    </>
  );
};

export default CourseAttendance;
