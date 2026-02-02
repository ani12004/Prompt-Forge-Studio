-- Award 'Legend of PromptForge' badge to User by Email
-- Uses a direct INSERT ... SELECT statement for simplicity.

INSERT INTO user_badges (user_id, badge_id)
SELECT 
    p.id AS user_id, 
    b.id AS badge_id
FROM profiles p, badges b
WHERE p.email = 'sutharani738@gmail.com'  -- Target Email
AND b.name = 'Legend of PromptForge'      -- Target Badge
ON CONFLICT (user_id, badge_id) DO NOTHING;

-- Verification Query (Run this after to check)
/*
SELECT p.email, b.name as badge_name, ub.earned_at
FROM user_badges ub
JOIN profiles p ON p.id = ub.user_id
JOIN badges b ON b.id = ub.badge_id
WHERE p.email = 'sutharani738@gmail.com';
*/
