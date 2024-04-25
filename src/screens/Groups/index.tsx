import { Container } from './styles';
import { FlatList, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';
import { useEffect, useState, useCallback } from 'react';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';
import { groupsGetAll } from '@storage/group/groupsGetAll';
import { Loading } from '@components/Loading';

export default function Groups() {
    const [isLoading, seIsLoading] = useState(true);
    const [groups, setGroups] = useState<string[]>([]);
    const navigation = useNavigation();

    function handleNewGroup() {
        navigation.navigate('new');
    }

    async function fetchGroups() {
        try {
            seIsLoading(true);
            const data = await groupsGetAll();
            setGroups(data);
        } catch (error) {
            console.log(error)
        } finally {
            seIsLoading(false);
        }
    }

    function handleOpenGroup(group: string) {
        console.log("ta clicando pra ir pra interna da turma")
        navigation.navigate('players', { group });
    }

    useFocusEffect(useCallback(() => {
        fetchGroups();
    }, []));

    return (
        <Container>
        <Header />
        <Highlight title='Turmas' subtitle='Jogue com a sua turma'/>

        { isLoading ? <Loading /> :
            <FlatList 
                data={groups}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <GroupCard 
                        title={item}
                        onPress={() => handleOpenGroup(item)}
                    />
                )}
                contentContainerStyle={groups.length === 0 && { flex: 1}}
                ListEmptyComponent={() => (
                    <ListEmpty message="Que tal cadastrar a primeira turma?"/>
                )}
                showsVerticalScrollIndicator={false}
            />
        }

        <Button 
            title="Criar nova turma"
            onPress={handleNewGroup}
        />
        </Container>
    );
}