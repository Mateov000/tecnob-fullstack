/**
*    File        : frontend/js/controllers/subjectsController.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

import { subjectsAPI } from '../api/subjectsAPI.js';

document.addEventListener('DOMContentLoaded', () => 
{
    loadSubjects();
    setupSubjectFormHandler();
    setupCancelHandler();
});

function setupSubjectFormHandler() 
{
  const form = document.getElementById('subjectForm');
  form.addEventListener('submit', async e => 
  {
        e.preventDefault();
        const subject = 
        {
            id: document.getElementById('subjectId').value.trim(),
            name: document.getElementById('name').value.trim()
        };

        try 
        {
            if (subject.id) 
            {
                await subjectsAPI.update(subject);
            }
            else
            {
                await subjectsAPI.create(subject);
            }
            
            form.reset();
            document.getElementById('subjectId').value = '';
            displayMessage(form, 'success', "Materia añadida con éxito");
            loadSubjects();
        }
        catch (err)
        {
            if(err.message = "La materia ya existe"){
                displayMessage(form, 'error', "No se pudo añadir la materia puesto que ya existe una con el mismo nombre");
            }
            console.error(err);
        }
  });
}

function displayMessage(padre, tipo, mensaje){
    let cartel = document.getElementById('cartel');

    if (!cartel){
        cartel = document.createElement('div');
        cartel.classList.add('w3-panel', 'w3-display-container');
        cartel.id = 'cartel';
        let btn_cerrar = document.createElement('button');
        btn_cerrar.classList.add('w3-button', 'w3-small', 'w3-display-topright');
        btn_cerrar.textContent = '×';
        btn_cerrar.addEventListener('click', (e) =>
        {
            e.preventDefault();
            e.currentTarget.parentNode.style.display = 'none';
        }
        );
        let mensajeCartel = document.createElement('span');
        mensajeCartel.id = 'mensaje-cartel';

        cartel.appendChild(btn_cerrar);
        cartel.appendChild(mensajeCartel);
        padre.appendChild(cartel);
    }
    cartel.style.display = 'block';
    document.getElementById('mensaje-cartel').textContent = mensaje;
    if(tipo == "error"){
        cartel.classList.add('w3-red');
        cartel.classList.remove('w3-green');


    }else{
        cartel.classList.add('w3-green');
        cartel.classList.remove('w3-red');
    }
}

function setupCancelHandler()
{
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => 
    {
        document.getElementById('subjectId').value = '';
    });
}

async function loadSubjects()
{
    try
    {
        const subjects = await subjectsAPI.fetchAll();
        renderSubjectTable(subjects);
    }
    catch (err)
    {
        console.error('Error cargando materias:', err.message);
    }
}

function renderSubjectTable(subjects)
{
    const tbody = document.getElementById('subjectTableBody');
    tbody.replaceChildren();

    subjects.forEach(subject =>
    {
        const tr = document.createElement('tr');

        tr.appendChild(createCell(subject.name));
        tr.appendChild(createSubjectActionsCell(subject));

        tbody.appendChild(tr);
    });
}

function createCell(text)
{
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}

function createSubjectActionsCell(subject)
{
    const td = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'w3-button w3-blue w3-small';
    editBtn.addEventListener('click', () => 
    {
        document.getElementById('subjectId').value = subject.id;
        document.getElementById('name').value = subject.name;
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'w3-button w3-red w3-small w3-margin-left';
    deleteBtn.addEventListener('click', () => confirmDeleteSubject(subject.id));

    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}

async function confirmDeleteSubject(id)
{
    if (!confirm('¿Seguro que deseas borrar esta materia?')) return;

    try
    {
        await subjectsAPI.remove(id);
        loadSubjects();
    }
    catch (err)
    {
        if(err.message == "Pertenece a una relacion")
            alert("No se puede borrar una materia si todavía existe algún alumno con una condición de aprobación sobre ella (aprobado/desaprobado)");
        else
            console.error('Error al borrar materia:', err.message);
    }
}
