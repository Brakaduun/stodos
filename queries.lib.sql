-- -- LIST
SELECT * FROM `tasks`;

-- -- INSERT
INSERT INTO `tasks` (`label`)
VALUES (:label);

-- -- UPDATE
UPDATE `tasks` SET `label` = :label
WHERE `id` = :id;

-- -- UPDATE STATUS
UPDATE `tasks` SET
`done` = :done,
`done_date` = CURRENT_TIMESTAMP
WHERE `id` = :id;

-- -- DELETE 
DELETE FROM `tasks` WHERE `id` = :id;


